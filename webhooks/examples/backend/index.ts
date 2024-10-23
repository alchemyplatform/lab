import { Hono } from "@hono/hono";
import { validateSignature } from "../../middleware/validate-signature.ts";
import { validatePayload } from "../../middleware/validate-payload.ts";
import type { AlchemyPayload } from "../../utils/schemas/index.ts";
import { convertToNftActivity } from "../../middleware/convert-to-nft-activity/index.ts";

const app = new Hono<{ Variables: { payload: AlchemyPayload } }>();

app.post(
  "/",
  validateSignature({
    signingKey: "whsec_Pd0W8f2mMnXv2YbpCiB8DzlY",
    // signingKey: new Map([
    //   ["wh_zkx600u6a74ntw19", "whsec_hye014cZDVAnzQEvZ2Qa45eZ"],
    //   ["wh_yj2nnzb6dxontpm2", "whsec_7hmAMzxbN2YKBlp4H5F3CXg7"],
    // ]),
  }),
  validatePayload,
  convertToNftActivity,
  () => new Response("Alchemy webhooks for the win!", { status: 200 })
);

export { app };

Deno.serve(app.fetch);
