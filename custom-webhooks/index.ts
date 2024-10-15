import { Hono, type Context } from "@hono/hono";

const app = new Hono();

app.post("/", async (c: Context) => {
  const body = await c.req.json();
  console.log(body);
  return c.status(200);
});

Deno.serve(app.fetch);
