import { Hono, type Context } from "@hono/hono";
import { Payload, TestPayload } from "./schemas/schemas.ts";
import { parse, ValiError } from "@valibot/valibot";

const app = new Hono();

app.post("/", async (c: Context) => {
  try {
    const headers = c.req.header();
    // console.log(headers);

    const body = await c.req.json();
    console.log(body);

    const payload = parse(TestPayload, body);
    console.log(payload);
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.log("Invalid JSON");
    } else if (e instanceof ValiError) {
      console.log(e.message);
    }
  }
  return c.status(200);
});

Deno.serve(app.fetch);
