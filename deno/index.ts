import { Gauge, Registry } from "https://deno.land/x/ts_prometheus/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { soxa } from 'https://deno.land/x/soxa/mod.ts'
import "https://deno.land/x/dotenv/load.ts";
import "https://deno.land/x/newdash/sleep.ts";

const URL = Deno.env.get('URL');
CheckEnvironmentVariable('URL', URL);

const CLIENTID = Deno.env.get('CLIENTID');
CheckEnvironmentVariable('CLIENTID', CLIENTID);

const CLIENTPASSWORD = Deno.env.get('CLIENTPASSWORD');
CheckEnvironmentVariable('CLIENTPASSWORD', CLIENTPASSWORD);

function CheckEnvironmentVariable(parameterName: any, parameterValue: any) {
    if (!parameterValue) {
        throw new Error(`${parameterName} is null or empty!`);
      }
    
      console.log(`${parameterName}: ${parameterValue}`);
}


const gauge = Gauge.with({
    name: 'ENDPOINT_AVAILABILITY',
    help: 'Shows availability of endpoint.',
    labels: ['mode'],
});

const app = new Application();

const router = new Router();
router
    .get("/hello", (ctx) => {
        ctx.response.body = "Hello world!";
    })
    .get("/hello/:name", (ctx) => {
        const { params } = ctx;
        ctx.response.body = `Hello, ${params.name}!`;
    })
    .get("/metrics", (ctx) => {
        ctx.response.headers.set("Content-Type", "");
        ctx.response.body = Registry.default.metrics();
    });

app.use(async (ctx, next) => {
    await next();
});

app.use(router.routes());

//while (1) {
    gauge.set(1);
    try {
        let response = await soxa.post(`${URL}`, {}, {
            auth: {
                username: `${CLIENTID}`,
                password: `${CLIENTPASSWORD}`
            }

        });

        console.log(response);
        console.log(response.body);
    } catch {
        console.log("something went wrong");
        gauge.set(0);
    }

    //sleep(10000);
//}

await app.listen({ port: 8080 });
