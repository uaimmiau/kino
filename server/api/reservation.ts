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
                AND r.active = true
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

router.get(
    "/api/user/stats/:username",
    async (ctx, next) => {
        await authenticateJWT(ctx, next, false);
    },
    async (ctx) => {
        const username = ctx?.params?.username;
        const connection = await pool.connect();
        try {
            const user = await connection.queryObject`
                SELECT email FROM kino.user
                WHERE username = ${username}`;
            const stats = await connection.queryArray`
                SELECT title, reserved_count::NUMERIC FROM kino.user_stats_view
                WHERE username = ${username}
            `;
            ctx.response.body = {
                user: user.rows,
                stats: stats.rows,
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

router.get(
    "/api/user/reservations/:username",
    async (ctx, next) => {
        await authenticateJWT(ctx, next, false);
    },
    async (ctx) => {
        const username = ctx?.params?.username;
        const connection = await pool.connect();
        try {
            const res = await connection.queryArray`
                SELECT
                    r.id as reservation_id,
                    m.title,
                    s.start_date,
                    se.number,
                    se.row,
                    ro.number
                FROM kino.reservation r
                JOIN kino.screening s ON r.screening_id = s.id
                JOIN kino.movie m ON s.movie_id = m.id
                JOIN kino.user u ON r.user_id = u.id
                JOIN kino.room ro ON s.room_id = ro.id
                JOIN kino.seat se ON r.seat_id = se.id
                WHERE u.username = ${username}
                    AND r.active = true`;
            ctx.response.body = res.rows;
        } catch (err) {
            console.log(err);
            ctx.response.status = 500;
            ctx.response.body = { msg: "Wewnętrzny błąd serwera" };
        } finally {
            connection.release();
        }
    }
);

router.delete(
    "/api/reservation/:id",
    async (ctx, next) => {
        await authenticateJWT(ctx, next, false);
    },
    async (ctx) => {
        const id = ctx?.params?.id;
        const connection = await pool.connect();
        try {
            await connection.queryArray`
                UPDATE kino.reservation SET active = false WHERE id = ${id}`;
            ctx.response.body = {
                msg: "Rezerwacja anulowana",
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

export default router;
