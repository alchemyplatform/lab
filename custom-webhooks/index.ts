import { Hono, type Context } from "@hono/hono";
import { Payload, TestPayload } from "./utils/schemas.ts";
import { parse, ValiError } from "@valibot/valibot";
import { parseTransfer } from "./utils/parseTransfer.ts";
import { DecodeLogDataMismatch } from "npm:viem";
import { toHex } from "npm:viem";

const app = new Hono();

app.post("/", async (c: Context) => {
  try {
    const headers = c.req.header();
    // TODO: validate signature

    const body = await c.req.json();
    const payload = parse(Payload, body);

    const {
      hash: blockHash,
      number: blockNumber,
      logs,
    } = payload.event.data.block;

    const activity = logs.flatMap((log) => {
      const decodedLog = parseTransfer(log);

      const isErc721 = decodedLog.eventName === "Transfer";

      const isErc1155 =
        decodedLog.eventName === "TransferSingle" ||
        decodedLog.eventName === "TransferBatch";

      if (!isErc721 && !isErc1155) {
        throw new Error("Invalid event");
      }

      const fromAddress = decodedLog.args.from.toLowerCase();
      const toAddress = decodedLog.args.to.toLowerCase();
      const contractAddress = log.account.address;
      const blockNum = toHex(blockNumber);
      const hash = log.transaction.hash;
      const log2 = {
        address: contractAddress,
        topics: log.topics,
        data: log.data,
        blockNumber: toHex(blockNumber),
        transactionHash: hash,
        transactionIndex: toHex(log.transaction.index),
        blockHash,
        logIndex: toHex(log.index),
        // TODO: remove field below
        removed: false,
      };

      if (isErc721) {
        const category = "erc721";
        return {
          fromAddress,
          toAddress,
          contractAddress,
          blockNum,
          hash,
          erc721TokenId: toHex(decodedLog.args.tokenId),
          category,
          log: log2,
        };
      }

      if (isErc1155) {
        const erc1155Metadata =
          decodedLog.eventName === "TransferBatch"
            ? decodedLog.args.ids.map((tokenId, i) => ({
                tokenId: toHex(tokenId),
                value: toHex(decodedLog.args.values[i]),
              }))
            : [
                {
                  tokenId: toHex(decodedLog.args.id),
                  value: toHex(decodedLog.args.value),
                },
              ];
        const category = "erc1155";

        const activityItem = {
          fromAddress,
          toAddress,
          contractAddress,
          blockNum,
          hash,
          erc1155Metadata,
          category,
          log: log2,
        };

        const numTokens =
          decodedLog.eventName === "TransferBatch"
            ? decodedLog.args.ids.length
            : 1;
        return new Array(numTokens).fill(activityItem);
      }
    });

    console.log(JSON.stringify(activity, null, 2));
  } catch (e) {
    console.log(e);
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
