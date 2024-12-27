import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import data from "./api/data.json" with {type: "json"};
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

export const app = new Application();
const router = new Router();
const databaseUrl = Deno.env.get("DATABASE_URL");
// const pool = new Pool(databaseUrl, 3, true);
// const connection = await pool.connect();

// console.log(databaseUrl)

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
