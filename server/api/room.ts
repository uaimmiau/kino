import { Router } from "jsr:@oak/oak/router";
import pool from "../util/db.ts";
import Validator from "../util/validator.ts";

const router = new Router();

router.post("/api/save_room", async (ctx) => {
    const reqBody = await ctx.request.body.json();
    const connection = await pool.connect();
    let isError: boolean = false;
    let errorMsg: string = "";
    [isError, errorMsg] = Validator.validateRoom(reqBody);
    if (isError) {
        ctx.response.body = { msg: errorMsg };
        ctx.response.status = 400;
    } else {
        try {
            const transaction = connection.createTransaction("abortable");
            await transaction.begin();

            const res = await transaction.queryArray`
                INSERT INTO kino.room (number, sponsor, technology)
                VALUES (${reqBody.roomNumber}, ${reqBody.roomSponsor}, ${reqBody.roomTechnology})
                RETURNING id;
            `;

            const roomID = res.rows[0][0];

            await transaction.queryArray`CALL insert_seats_json(${roomID}, ${JSON.stringify(
                reqBody.seatList.flat()
            )});`;

            await transaction.commit();

            ctx.response.body = { msg: "Dodano" };
        } catch (err) {
            console.log(err);
            ctx.response.status = 500;
            ctx.response.body = { msg: "Wewnętrzny błąd serwera" };
        } finally {
            connection.release();
        }
    }
});

router.get("/api/rooms", async (ctx) => {
    const connection = await pool.connect();
    try {
        const res = await connection.queryArray`
        SELECT id, number, sponsor FROM kino.room;`;
        ctx.response.body = res.rows;
    } catch (err) {
        console.log(err);
        ctx.response.status = 500;
        ctx.response.body = { msg: "Wewnętrzny błąd serwera" };
    } finally {
        connection.release();
    }
});

router.get("/api/room/:id", async (ctx) => {
    const id = ctx?.params?.id;
    const connection = await pool.connect();
    try {
        const room = await connection.queryObject`
            SELECT number, sponsor, technology FROM kino.room WHERE id = ${id};`;
        const seats = await connection.queryArray`
            SELECT dim_x, dim_y, row, number, seat_type
            FROM kino.seat
            WHERE room_id = ${id}
            ORDER BY row, number
        `;
        ctx.response.body = {
            room: room.rows,
            seats: seats.rows,
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
