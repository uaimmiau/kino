import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import data from "./api/data.json" with {type: "json"};
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import "jsr:@std/dotenv/load";
import Validator from "./util/validator.ts";

export const app = new Application();
const router = new Router();

const pass = Deno.env.get("DB_PASS");
const pool = new Pool({
    user: "postgres",
    database: "postgres",
    hostname: "solely-evolved-antlion.data-1.use1.tembo.io",
    port: 5432,
    password: pass,
    tls: {
        caCertificates: [
            await Deno.readTextFile(
              new URL("./ca.crt", import.meta.url),
            ),
          ],
        enabled: true,
    },
  }, 5, true);

router.post("/api/save_room", async (ctx) => {
    const reqBody = await ctx.request.body.json();
    const connection = await pool.connect();
    let isError: boolean = false;
    let errorMsg: string = "";
    [isError, errorMsg] = Validator.validateRoom(reqBody);
    if(isError){
        ctx.response.body = {msg: errorMsg};
        ctx.response.status = 400;
    } else {
        try{
            const transaction = connection.createTransaction("abortable");
            await transaction.begin();

            const res = await transaction.queryArray`
                INSERT INTO kino.room (number, sponsor, technology)
                VALUES (${reqBody.roomNumber}, ${reqBody.roomSponsor}, ${reqBody.roomTechnology})
                RETURNING id;
            `;

            const roomID = res.rows[0][0];

            await transaction.queryArray`call insert_seats_json(${roomID}, ${JSON.stringify(reqBody.seatList.flat())});`;

            await transaction.commit();

            ctx.response.body = {msg: "Dodano"};
        } catch(err){
            console.log(err);
            ctx.response.status = 500;
            ctx.response.body = {msg: "Wewnętrzny błąd serwera"};
        } finally {
            connection.release();
        }
    }

});

router.get("/api/dinosaurs", (context) => {
    context.response.body = data;
});

router.get("/api/dinosaurs/:dinosaur", (context) => {
    if(!context?.params?.dinosaur){
        context.response.body = "No dinosaur name provided.";
    }
    
    const dinosaur = data.find((item) => 
        item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
)

// console.log(dinosaur);

context.response.body = dinosaur ?? "No dinosaur found.";
});


app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(
    routeStaticFilesFrom([
        `${Deno.cwd()}/client/dist`,
        `${Deno.cwd()}/client/public`,
    ])
);

if (import.meta.main) {
    console.log("Server listening on port http://localhost:8000");
    await app.listen({ port: 8000 });
}
