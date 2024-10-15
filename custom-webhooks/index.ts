import { Hono, type Context } from "@hono/hono";
import { Payload, TestPayload } from "./utils/schemas.ts";
import { parse, ValiError } from "@valibot/valibot";
import { TRANSFER_EVENT_SIGNATURE } from "./utils/event-signatures.ts";

const app = new Hono();

app.post("/", async (c: Context) => {
  try {
    const headers = c.req.header();
    // TODO: validate signature

    const body = await c.req.json();
    const payload = parse(TestPayload, body);

    const logs = payload.event.data.block.logs;
    for (const log of logs) {
      const [topic0] = log.topics;
      switch (topic0) {
        case TRANSFER_EVENT_SIGNATURE: {
          continue;
        }
      }
    }
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
