// deno run --allow-net --allow-env --env scripts/index.ts

import { WebhookSdk } from "./utils/sdk.ts";

const sdk = new WebhookSdk({ authToken: Deno.env.get("WEBHOOK_AUTH_TOKEN")! });

const webhooks = await sdk.getAll();
console.log(webhooks);
