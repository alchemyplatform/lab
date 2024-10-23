/***
 *
 * Track ERC721 transfers for specific contracts and users.
 *
 * This example uses Custom Webhooks and Custom Webhooks variables.
 *
 * We create 2 webhooks - one for incoming ERC721 transfers and one for outgoing ERC721 transfers.
 *
 */

import { pad, type Hex } from "npm:viem";
import { WebhookSdk } from "../utils/sdk/index.ts";

const QUERY_ERC721_TRANSFER_OUT = `
# Outgoing ERC721 transfers
query ($contractAddresses: [Address!]!, $userAddresses: [Bytes32!]!) {
  block {
    hash
    number
    logs(
      filter: {
        addresses: $contractAddresses
        topics: [
          # event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
          # IMPORTANT - you must pad the address because filtering with topics
          $userAddresses
          []
        ]
      }
    ) {
      data
      topics
      index
      account {
        address
      }
      transaction {
        hash
        index
      }
    }
  }
}
`;

const QUERY_ERC_721_TRANSFER_IN = `
# Incoming ERC721 transfers
query ($contractAddresses: [Address!]!, $userAddresses: [Bytes32!]!) {
  block {
    hash
    number
    logs(
      filter: {
        addresses: $contractAddresses
        topics: [
          # event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
          []
          # IMPORTANT - you must pad the address because filtering with topics
          $userAddresses
        ]
      }
    ) {
      data
      topics
      index
      account {
        address
      }
      transaction {
        hash
        index
      }
    }
  }
}
`;

/**
 *
 * 1. Get your webhook auth token & set it in .env file.
 *
 * This token is used to authenticate your requests to the Alchemy Webhooks API.
 *
 * You can find this token in the Alchemy dashboard (https://dashboard.alchemy.com/webhooks) in the top right corner.
 *
 */
const authToken = Deno.env.get("WEBHOOK_AUTH_TOKEN");
if (!authToken) {
  throw new Error("WEBHOOK_AUTH_TOKEN env variable is required");
}

/**
 *
 * 2. Define the networks you want to track ERC721 transfers on.
 *
 * List of possible networks can be found in our docs (https://docs.alchemy.com/reference/notify-api-quickstart).
 *
 */
const networks = ["ETH_MAINNET"];

/**
 *
 * 3. Define the ERC721 contract addresses and user addresses you want to track.
 *
 * IMPORTANT - Example assumes that you want to track same contract and user addresses on all networks. You can tweak it as needed.
 *
 */
const contractAddresses = new Set([
  // MutantApeYachtClub (MAYC) contract address on Ethereum Mainnet
  "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
]);

const addresses = new Set([
  // Vitalik's address
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
]);

// Initialize thin webhook client to simplify making calls to our API
// You can also use fetch or any other HTTP client.
const client = new WebhookSdk({ authToken });

/**
 * 4. Set the webhook URL where you want to receive notifications.
 *
 * Note - this assumes you want to receive notifications for all networks on the same URL.
 */
const webhookUrl = "https://play.svix.com/in/e_zrqf1pDjASk9O6n6t284bFymLv7/";

/**
 * 5. Create webhooks for incoming and outgoing ERC721 transfers.
 */
for (const network of networks) {
  for (const query of [QUERY_ERC721_TRANSFER_OUT, QUERY_ERC_721_TRANSFER_IN]) {
    const { data: webhook } = await client.create({
      type: "GRAPHQL",
      network,
      url: webhookUrl,
      graphQlQuery: {
        query,
        skipEmptyMessages: true,
      },
    });
    console.log(
      `=> Webhook created! 🥳
Network: ${webhook.network}
Type:    ${webhook.webhook_type}
Id:      ${webhook.id}
Created at: ${new Date(webhook.time_created)}
`
    );
  }
}

/**
 *
 * 6. Create Custom webhook variables for contract addresses and user addresses.
 *
 */
const VARIABLE_CONTRACT_ADDRESSES = "contractAddresses";

await client.createVariable({
  variable: VARIABLE_CONTRACT_ADDRESSES,
  items: Array.from(contractAddresses),
});
console.log(
  '=> Created variable "contractAddresses"',
  await client.getVariableElements({ variable: VARIABLE_CONTRACT_ADDRESSES })
);

const VARIABLE_USER_ADDRESSES = "userAddresses";
await client.createVariable({
  variable: VARIABLE_USER_ADDRESSES,
  items: [...addresses].map((address) => pad(address as Hex)),
});

console.log(
  '=> Created variable "userAddresses"',
  await client.getVariableElements({ variable: VARIABLE_USER_ADDRESSES })
);

// await client.deleteVariable({ variable: VARIABLE_CONTRACT_ADDRESSES });
// await client.deleteVariable({ variable: VARIABLE_USER_ADDRESSES });

/**
 *
 * 7. Start backend server to receive events
 *
 * You'll need ngrok, localhost or some tunneling service to expose your local server to the internet (if developing locally).
 *
 */
