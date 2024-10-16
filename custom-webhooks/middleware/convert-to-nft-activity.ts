import { createMiddleware } from "@hono/hono/factory";
import type { Context } from "@hono/hono";
import type { Payload } from "../utils/types.ts";
import { parseTransfer } from "../utils/parseTransfer.ts";
import { toHex } from "npm:viem";

export const convertToNftActivity = createMiddleware(
  async (
    ctx: Context<{
      Variables: {
        payload: Payload;
      };
    }>,
    next
  ) => {
    const payload = ctx.get("payload");
    if (!payload) {
      throw new Error("Payload not found");
    }

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

    await next();
  }
);
