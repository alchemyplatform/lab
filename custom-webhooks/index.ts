import { Hono } from "@hono/hono";
import { ValiError } from "@valibot/valibot";
import { validateSignature } from "./middleware/validate-signature.ts";
import { validatePayload } from "./middleware/validate-payload.ts";
import type { AlchemyPayload } from "./utils/schemas/index.ts";
import { convertToNftActivity } from "./middleware/convert-to-nft-activity.ts";
import { superWebhook } from "./middleware/super-webhook.ts";

const app = new Hono<{ Variables: { payload: AlchemyPayload } }>();

app.post(
  "/",
  validateSignature({
    signingKey: "whsec_QkKHJwIh9G8OdsrKllkGpA60",
    // signingKey: new Map([
    //   ["wh_zkx600u6a74ntw19", "whsec_hye014cZDVAnzQEvZ2Qa45eZ"],
    //   ["wh_yj2nnzb6dxontpm2", "whsec_7hmAMzxbN2YKBlp4H5F3CXg7"],
    // ]),
  }),
  validatePayload,
  // convertToNftActivity,
  superWebhook,
  async (ctx) => {
    let json;
    try {
      json = await ctx.req.json();
      const payload = ctx.var.payload;
      // console.log("Payload", payload);
    } catch (e) {
      if (e instanceof ValiError) {
        console.log(
          e.issues.map((i) => i.path.map((path) => path.key).join("."))
        );
      }
      console.log(JSON.stringify(json.logs, null, 2));
    }
    return new Response("", { status: 200 });
  }
);

Deno.serve(app.fetch);
