import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import data from "./api/data.json" with {type: "json"};
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import "jsr:@std/dotenv/load";

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
const connection = await pool.connect();
const res = await connection.queryObject`
  SELECT * FROM kino.room
`
// console.log(res)

router.post("/api/save_room", async (ctx) => {
    const reqBody = await  ctx.request.body.json();
    console.log(reqBody);
    ctx.response.body = "Duppa";
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
