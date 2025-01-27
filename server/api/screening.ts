import { Router } from "jsr:@oak/oak/router";
import pool from "../util/db.ts";
import { authenticateJWT } from "./auth.ts";
import { PostgresError } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const router = new Router();

router.post(
    "/api/save_screening",
    async (ctx, next) => {
        await authenticateJWT(ctx, next, true);
    },
    async (ctx) => {
        const formData = await ctx.request.body.formData();
        const connection = await pool.connect();
        try {
            await connection.queryObject`
            INSERT INTO kino.screening
            VALUES(DEFAULT, ${formData.get("movieID")}, ${formData.get(
                "roomID"
            )}, ${formData.get("dateStart")}, ${formData.get(
                "normalPrice"
            )}::numeric, ${formData.get("vipPrice")}::numeric);
        `;
            ctx.response.body = {
                msg: "Dodano seans do repertuaru",
            };
        } catch (err) {
            if (err instanceof PostgresError) {
                if (err?.fields.code == "P0010") {
                    ctx.response.status = 409;
                    ctx.response.body = {
                        msg: "Dodany seans zachodzi no inny w tej sali",
                    };
                }
            } else {
                ctx.response.status = 500;
                ctx.response.body = { msg: "Wewnętrzny błąd serwera" };
            }
        } finally {
            connection.release();
        }
    }
);
export default router;
