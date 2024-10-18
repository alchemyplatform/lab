import { createMiddleware } from "@hono/hono/factory";
import type { Context } from "@hono/hono";
import type { AlchemyPayload } from "../utils/schemas/index.ts";
import { decodeLog } from "../utils/events/decode.ts";
import { parse } from "@valibot/valibot";
import { GraphQlToNftActivitySchema } from "../utils/schemas/convert.ts";

type ContractMetadata = {
  name: string | null;
  symbol: string | null;
};

const contractAddressToMetadata = new Map<string, ContractMetadata>();

export const superWebhook = createMiddleware(
  async (
    ctx: Context<{
      Variables: {
        payload: AlchemyPayload;
      };
    }>,
    next
  ) => {
    // TODO: use different schema
    const payload = parse(GraphQlToNftActivitySchema, ctx.get("payload"));

    const {
      hash: blockHash,
      number: blockNumber,
      logs,
    } = payload.event.data.block;

    const addresses = new Set<string>();
    const decodedLogs = logs
      .filter((log) => log !== null)
      .map((log) => {
        const contractAddress = log.account.address;
        const decodedLog = decodeLog(log);
        const metadata = contractAddressToMetadata.get(contractAddress);
        if (!metadata) {
          addresses.add(contractAddress);
        }
        return {
          contractAddress,
          metadata,
          ...decodedLog,
        };
      });
    console.log(decodedLogs);

    // TODO: batch calls
    // Fetch metadata for all addresses
    for (const address of addresses) {
      const metadata = await fetchMetadata(address);
      contractAddressToMetadata.set(address, metadata);
    }

    if (addresses.size > 0) {
      console.log(`# of metadata entries: ${contractAddressToMetadata.size}`);
    }

    await next();
  }
);

async function fetchMetadata(contractAddress: string) {
  const url = `https://eth-mainnet.g.alchemy.com/nft/v3/alch-demo/getContractMetadata?contractAddress=${contractAddress}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = (await response.json()) as ContractMetadata;
  // console.log(json);
  return { name: json.name, symbol: json.symbol };
}
