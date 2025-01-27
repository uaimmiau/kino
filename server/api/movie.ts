import { Router } from "jsr:@oak/oak/router";
import pool from "../util/db.ts";
import { authenticateJWT } from "./auth.ts";

const router = new Router();

router.post(
    "/api/save_movie",
    async (ctx, next) => {
        await authenticateJWT(ctx, next, true);
    },
    async (ctx) => {
        const formData = await ctx.request.body.formData();
        const connection = await pool.connect();
        try {
            const poster: File = formData.get("poster") as File;
            const bytes = await poster.arrayBuffer();
            const bytea = new Uint8Array(bytes);
            await connection.queryObject`
            INSERT INTO kino.movie
            VALUES(DEFAULT, ${formData.get("name")}, ${formData.get(
                "desc"
            )}, ${formData.get("runtime")}::smallint, ${bytea});
        `;
            ctx.response.body = {
                msg: "Dodano film",
            };
        } catch (err) {
            console.log(err);
            ctx.response.status = 500;
            ctx.response.body = { msg: "Wewnętrzny błąd serwera" };
        } finally {
            connection.release();
        }
    }
);

router.get("/api/movies", async (ctx) => {
    const connection = await pool.connect();
    try {
        const res = await connection.queryArray`
        SELECT id, title, runtime FROM kino.movie;`;
        ctx.response.body = res.rows;
    } catch (err) {
        console.log(err);
        ctx.response.status = 500;
        ctx.response.body = { msg: "Wewnętrzny błąd serwera" };
    } finally {
        connection.release();
    }
});

router.get("/api/movie/:id", async (ctx) => {
    const id = ctx?.params?.id;
    const connection = await pool.connect();
    try {
        const res = await connection.queryObject<{
            title: string;
            description: string;
            runtime: string;
            poster: Uint8Array;
        }>`
            SELECT title, description, runtime, poster FROM kino.movie WHERE id = ${id};`;
        const movie = res.rows[0];

        ctx.response.body = {
            title: movie.title,
            desc: movie.description,
            runtime: movie.runtime,
            poster: Array.from(movie.poster),
        };
    } catch (err) {
        console.log(err);
        ctx.response.status = 500;
        ctx.response.body = { msg: "Wewnętrzny błąd serwera" };
    } finally {
        connection.release();
    }
});

export default router;
