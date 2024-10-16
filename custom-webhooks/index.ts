import { Hono, type Context } from "@hono/hono";
// import { Payload, TestPayload } from "./utils/schemas.ts";
import { parse, ValiError } from "@valibot/valibot";
import { DecodeLogDataMismatch } from "npm:viem";
import { validateSignature } from "./middleware/validate-signature.ts";
import { validatePayload } from "./middleware/validate-payload/index.ts";
import type { Payload } from "./utils/types.ts";
import { convertToNftActivity } from "./middleware/convert-to-nft-activity.ts";

const app = new Hono<{ Variables: { payload: Payload } }>();

app.post(
  "/",
  validateSignature({
    signingKey: Deno.env.get("WEBHOOK_SIGNING_KEY")!,
    debug: true,
  }),
  validatePayload(),
  convertToNftActivity
);

app.post("/", () => {
  // try {
  //   const payload = ctx.get("payload");
  // } catch (e) {
  //   console.log(e);
  //   if (e instanceof SyntaxError) {
  //     console.log("Invalid JSON");
  //   } else if (e instanceof ValiError) {
  //     console.log(e.message);
  //   } else if (e instanceof DecodeLogDataMismatch) {
  //     console.log(e.message, e.params, e.data, e.abiItem);
  //   }
  // }
  return new Response("", { status: 200 });
});

Deno.serve(app.fetch);
