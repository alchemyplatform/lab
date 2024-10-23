// deno run --allow-net --allow-env --env --watch scripts/index.ts

import { QUERY_TRACK_ALL_ERC20_EVENTS } from "../queries/erc20/track-all-erc20-events.ts";
import { WebhookSdk } from "../utils/sdk/index.ts";

const sdk = new WebhookSdk({ authToken: Deno.env.get("WEBHOOK_AUTH_TOKEN")! });

// const webhooks = await sdk.getAll();
// console.log(webhooks);

// const addresses = await sdk.getAllAddresses({
//   webhookId: "wh_gb1pd3oa0hkmy2ax",
//   limit: 1,
// });
// console.log(addresses);

const svixUrl = "https://play.svix.com/in/e_zrqf1pDjASk9O6n6t284bFymLv7/";

// const webhookId = "wh_gb1pd3oa0hkmy2ax";

// const webhook = await sdk.create({
//   type: "GRAPHQL",
//   network: "ETH_MAINNET",
//   url: svixUrl,
//   graphQlQuery: QUERY_TRACK_ALL_ERC20_EVENTS,
// });
// console.log(webhook);

// await sdk.addRemoveAddresses({
//   webhookId,
//   addressesToAdd: ["0x07c39105a9bd23da07d728b7d5d7b8b21137a635"],
//   // addressesToRemove: ["test"],
// });

// await sdk.replaceAddresses({ webhookId, addresses: [] });

// await sdk.updateStatus({
//   webhookId,
//   isActive: true,
// });
// // console.log(await sdk.getAll());

// await sdk.updateStatus({
//   webhookId,
//   isActive: false,
// });

// const webhookIdNftActivity = "wh_dynjpog78q9tw8xc";

// await sdk.updateNftFilters({
//   webhookId: webhookIdNftActivity,
// });

// await sdk.updateNftMetadataFilters({
//   webhookId: webhookIdNftActivity,
// });

// await sdk.getNftFilters({
//   webhookId: webhookIdNftActivity,
// });

// const id = "wh_gb1pd3oa0hkmy2ax";

// await sdk.delete({ webhookId: id });

console.log(await sdk.getAll());
