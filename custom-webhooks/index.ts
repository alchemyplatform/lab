import { Hono, type Context } from "@hono/hono";
import { Payload, TestPayload } from "./utils/schemas.ts";
import { parse, ValiError } from "@valibot/valibot";
import { parseTransfer } from "./utils/parseTransfer.ts";
import { DecodeLogDataMismatch } from "npm:viem";

const app = new Hono();

app.post("/", async (c: Context) => {
  try {
    const headers = c.req.header();
    // TODO: validate signature

    const body = await c.req.json();
    const payload = parse(Payload, body);

    const logs = payload.event.data.block.logs;
    for (const log of logs) {
      const decodedLog = parseTransfer(log);
      console.log({ address: log.account.address, ...decodedLog });
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.log("Invalid JSON");
    } else if (e instanceof ValiError) {
      console.log(e.message);
    } else if (e instanceof DecodeLogDataMismatch) {
      console.log(e.message, e.params, e.data, e.abiItem);
    }
  }
  return c.status(200);
});

Deno.serve(app.fetch);
