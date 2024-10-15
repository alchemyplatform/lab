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
    for (const log of logs) {
      const decodedLog = parseTransfer(log);

      const isErc1155 =
        decodedLog.eventName === "TransferSingle" ||
        decodedLog.eventName === "TransferBatch";

      if (isErc1155) {
        const fromAddress = decodedLog.args.from;
        const toAddress = decodedLog.args.to;
        const contractAddress = log.account.address;
        const blockNum = toHex(blockNumber);
        const hash = log.transaction.hash;
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
        const log2 = {
          address: contractAddress,
          topics: log.topics,
          data: log.data,
          blockNumber: toHex(blockNumber),
          transactionHash: hash,
          transactionIndex: toHex(log.transaction.index),
          blockHash,
          logIndex: toHex(log.index),
          // removed: null,
        };

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
        const activity =
          decodedLog.eventName === "TransferBatch"
            ? new Array(decodedLog.args.ids.length).fill(activityItem)
            : [activityItem];

        console.log(JSON.stringify(activity, null, 2));
      }
    }
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
