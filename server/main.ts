import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import "jsr:@std/dotenv/load";
import roomRouter from "./api/room.ts";
import movieRouter from "./api/movie.ts";

export const app = new Application();
const router = new Router();

app.use(roomRouter.routes());
app.use(roomRouter.allowedMethods());

app.use(movieRouter.routes());
app.use(movieRouter.allowedMethods());

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
