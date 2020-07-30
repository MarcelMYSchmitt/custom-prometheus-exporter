import { serve } from 'https://deno.land/std/http/server.ts'
import { Gauge, Registry } from "https://deno.land/x/ts_prometheus/mod.ts";

/*

HTTP SERVER

*/ 

const httpServer = serve({ port: 8000 })
console.log(`🦕 Deno server running at http://localhost:8000/ 🦕`)

for await (const req of httpServer) {
  req.respond({ body: 'Hello from your first Deno server' })
}

/*

METRICS

*/

const counter = Gauge.with({
    name: "http_requests_total",
    help: "The total HTTP requests",
    labels: ["path", "method", "status"],
  });
  