/**
 *
 * deno run --allow-net --allow-env --env examples/sdk.ts
 *
 */

import { WebhookSdk } from "../utils/sdk/index.ts";

const authToken = Deno.env.get("WEBHOOK_AUTH_TOKEN");

if (!authToken) {
  throw new Error("WEBHOOK_AUTH_TOKEN is required");
}

const sdk = new WebhookSdk({ authToken });

const variable = "test";

await sdk.getVariableElements({ variable });

await sdk.createVariable({
  variable,
  items: ["0x60E4d786628Fea6478F785A6d7e704777c86a7c8"],
});

await sdk.getVariableElements({ variable });
