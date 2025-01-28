import { Router, RouterContext } from "jsr:@oak/oak/router";
import pool from "../util/db.ts";
import {
    hash as hashPromise,
    hashSync,
    compare as comparePromise,
    compareSync,
    genSaltSync,
} from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { JWTPayload, jwtVerify, SignJWT } from "npm:jose@5.9.6";
import { Context } from "@oak/oak/context";
import * as cookie from "https://deno.land/std/http/cookie.ts";

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
        return payload;
    } catch (_err) {
        return null;
    }
}

export const authenticateJWT = async (
    ctx: Context,
    next: () => Promise<unknown>,
    adminOnly: boolean
) => {
    const cookies = cookie.getCookies(ctx.request.headers);
    const jwt = await verifyJWT(cookies.jwt);
    if (jwt) {
        if (adminOnly && !jwt.isAdmin) {
            ctx.response.status = 401;
            ctx.response.body = {
                msg: "Brak dostępu administratora",
            };
        }
        ctx.state.user = jwt.user;
        ctx.state.isAdmin = jwt.isAdmin;
        ctx.state.user_id = jwt.id;
        await next();
    } else {
        ctx.response.status = 401;
        ctx.response.body = {
            msg: "Brak dostępu",
        };
    }
};

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
            id: number;
            salt: string;
            password_hash: string;
            admin: boolean;
        }>`
            SELECT id, salt, password_hash, admin FROM kino.user
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
            const isAdmin = res.rows[0].admin;
            const token = await createJWT({
                user: reqBody.username,
                isAdmin: isAdmin,
                id: res.rows[0].id,
            });
            ctx.cookies.set("jwt", token, {
                httpOnly: true,
                secure: secureCookie,
                sameSite: "strict",
                maxAge: 3600,
            });
            ctx.response.body = {
                msg: "Zalogowano",
                admin: isAdmin,
            };
        } else {
            ctx.response.status = 401;
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

router.post("/api/logout", (ctx) => {
    ctx.cookies.set("jwt", "", {
        httpOnly: true,
        secure: secureCookie,
        sameSite: "strict",
        maxAge: 0,
    });
    ctx.response.body = {
        msg: "Wylogowano",
    };
});

router.get(
    "/api/auth",
    async (ctx, next) => {
        await authenticateJWT(ctx, next, false);
    },
    (ctx) => {
        ctx.response.status = 200;
        ctx.response.body = {
            user: ctx.state.user,
            isAdmin: ctx.state.isAdmin,
        };
    }
);

export default router;
