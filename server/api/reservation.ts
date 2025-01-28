import { Router } from "jsr:@oak/oak/router";
import pool from "../util/db.ts";
import { authenticateJWT } from "./auth.ts";

const router = new Router();

router.post(
    "/api/save_reservation",
    async (ctx, next) => {
        await authenticateJWT(ctx, next, false);
    },
    async (ctx) => {
        const data = await ctx.request.body.json();
        const connection = await pool.connect();
        try {
            const transaction = connection.createTransaction("abortable");
            await transaction.begin();

            for (let seat_id of data.selectedSeats) {
                transaction.queryArray`
                INSERT INTO kino.reservation
                VALUES(DEFAULT, ${ctx.state.user_id}, ${data.screening_id}, ${seat_id}, true)
                `;
            }

            await transaction.commit();
            ctx.response.body = {
                msg: "Zapisano rezerwacje",
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

router.get("/api/reservation/seats/:id", async (ctx) => {
    const id = ctx?.params?.id;
    const connection = await pool.connect();
    try {
        const seats = await connection.queryArray`
            SELECT s.id as seat_id
            FROM kino.seat s
            JOIN kino.reservation r on s.id = r.seat_id
            WHERE r.screening_id = ${id}
        `;
        ctx.response.body = seats.rows;
    } catch (err) {
        console.log(err);
        ctx.response.status = 500;
        ctx.response.body = { msg: "Wewnętrzny błąd serwera" };
    } finally {
        connection.release();
    }
});

export default router;
