import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const pass = Deno.env.get("DB_PASS");
const pool = new Pool(
    {
        user: "postgres",
        database: "postgres",
        hostname: "solely-evolved-antlion.data-1.use1.tembo.io",
        port: 5432,
        password: pass,
        tls: {
            caCertificates: [
                await Deno.readTextFile(new URL("./ca.crt", import.meta.url)),
            ],
            enabled: true,
        },
    },
    5,
    true
);

export default pool;
