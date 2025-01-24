import { Router } from "jsr:@oak/oak/router";
import pool from "../util/db.ts";

const router = new Router();

router.post("/api/save_movie", async (ctx) => {
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
});

export default router;
