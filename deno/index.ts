import { Gauge, Registry } from "https://deno.land/x/ts_prometheus/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { soxa } from 'https://deno.land/x/soxa/mod.ts'
import { delay } from "https://deno.land/std@0.63.0/async/delay.ts";

import "https://deno.land/x/dotenv/load.ts";


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


// Prometheus Metrics
const gauge = Gauge.with({
    name: 'ENDPOINT_AVAILABILITY',
    help: 'Shows availability of endpoint.',
    labels: ['mode'],
});


// Metric Server
const app = new Application();
const router = new Router();
router
    .get("/hello", (ctx) => {
        ctx.response.body = "Hello world!";
    })
    .get("/metrics", (ctx) => {
        ctx.response.headers.set("Content-Type", "");
        ctx.response.body = Registry.default.metrics();
    });

app.use(async (ctx, next) => {
    await next();
});

app.use(router.routes());

while (1) {
    gauge.set(1);
    try {
        
        let response = await soxa.post(`${URL}`, {}, {
            auth: {
                username: `${CLIENTID}`,
                password: `${CLIENTPASSWORD}`
            }

        });

        const stringified = JSON.stringify(response.data);
        console.log(stringified);

        let jsonObjet = JSON.parse(stringified);
        let accessToken = jsonObjet.access_token;
        let tokenType = jsonObjet.token_type;
        let expiresIn =  jsonObjet.expires_in;

        if (accessToken && tokenType && expiresIn) {
            console.log(accessToken);
            console.log(tokenType);
            console.log(expiresIn);

            console.log("Set endpoint availabilty metric to 1.")
            gauge.set(1);
        }
    } catch {
        console.log("Something went wrong, set endpont availabilty metric to 0.");
        gauge.set(0);
    }

    // wait 10 seconds for another request
    await delay(10000);
}


// expose port
await app.listen({ port: 8080 });   