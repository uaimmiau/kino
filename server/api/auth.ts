import { Router } from "jsr:@oak/oak/router";
import pool from "../util/db.ts";
import {
    hash as hashPromise,
    hashSync,
    compare as comparePromise,
    compareSync,
    genSaltSync,
} from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { JWTPayload, jwtVerify, SignJWT } from "npm:jose@5.9.6";

const router = new Router();
const secureCookie = false; //should be true on prod;

// This section is supposedly helping with Deno Deploy
// Will investigate later

const isRunningInDenoDeploy = (globalThis as any).Worker === undefined;

const hash: typeof hashPromise = isRunningInDenoDeploy
    ? (plaintext: string, salt: string | undefined = undefined) =>
          new Promise((res) => res(hashSync(plaintext, salt)))
    : hashPromise;

const compare: typeof comparePromise = isRunningInDenoDeploy
    ? (plaintext: string, hash: string) =>
          new Promise((res) => res(compareSync(plaintext, hash)))
    : comparePromise;

// ----------------------------------------------------

const secret = new TextEncoder().encode(Deno.env.get("JWT_SECRET"));

async function createJWT(payload: JWTPayload): Promise<string> {
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);

    return jwt;
}

async function verifyJWT(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        console.log("JWT is valid:", payload);
        return payload;
    } catch (error) {
        console.error("Invalid JWT:", error);
        return null;
    }
}

router.post("/api/register", async (ctx) => {
    const reqBody = await ctx.request.body.json();
    const connection = await pool.connect();
    try {
        const res = await connection.queryArray`
            SELECT 1 FROM kino.user
            WHERE username = ${reqBody.username}
        `;
        if (res.rows.length > 0) {
            ctx.response.status = 409;
            ctx.response.body = {
                msg: "Użytkownik o podanym loginie już istnieje",
            };
            return;
        }

        const salt = await genSaltSync(8);
        const hashedPassword = await hash(reqBody.password, salt);

        await connection.queryObject`
            INSERT INTO kino.user (id, username, email, salt, password_hash)
            VALUES (DEFAULT, ${reqBody.username}, ${reqBody.email}, ${salt}, ${hashedPassword})
        `;

        ctx.response.body = { msg: "Zarejestrowano użytkownika" };
    } catch (err) {
        console.log(err);
        ctx.response.status = 500;
        ctx.response.body = { msg: "Wewnętrzny błąd serwera" };
    } finally {
        connection.release();
    }
});

router.post("/api/login", async (ctx) => {
    const reqBody = await ctx.request.body.json();
    const connection = await pool.connect();
    try {
        const res = await connection.queryObject<{
            salt: string;
            password_hash: string;
        }>`
            SELECT salt, password_hash FROM kino.user
            WHERE username = ${reqBody.username}
        `;

        if (res.rows.length === 0) {
            ctx.response.status = 404;
            ctx.response.body = {
                msg: "Użytkownik o podanym loginie nie istnieje",
            };
            return;
        }

        const isValid = await compare(
            reqBody.password,
            res.rows[0].password_hash
        );

        if (isValid) {
            const token = await createJWT({ user: reqBody.username });
            ctx.cookies.set("jwt", token, {
                httpOnly: true,
                secure: secureCookie,
                sameSite: "strict",
                maxAge: 3600,
            });
            ctx.response.body = { msg: "Zalogowano" };
        } else {
            ctx.response.body = { msg: "Złe hasło" };
        }
    } catch (err) {
        console.log(err);
        ctx.response.status = 500;
        ctx.response.body = { msg: "Wewnętrzny błąd serwera" };
    } finally {
        connection.release();
    }
});

export default router;
