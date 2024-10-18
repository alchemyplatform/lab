import { createMiddleware } from "@hono/hono/factory";
import type { Context } from "@hono/hono";
import type { AlchemyPayload } from "../utils/schemas/index.ts";
import { toHex } from "npm:viem";
import { decodeLog } from "../utils/events/decode.ts";
import { parse } from "@valibot/valibot";
import { GraphQlToNftActivitySchema } from "../utils/schemas/convert.ts";

export const convertToNftActivity = createMiddleware(
  async (
    ctx: Context<{
      Variables: {
        payload: AlchemyPayload;
      };
    }>,
    next
  ) => {
    const payload = parse(GraphQlToNftActivitySchema, ctx.get("payload"));

    const {
      hash: blockHash,
      number: blockNumber,
      logs,
    } = payload.event.data.block;

    const activity = logs.flatMap((log) => {
      const decodedLog = decodeLog(log);
      if (!decodedLog) {
        return [];
      }

      const isErc721 =
        decodedLog.type === "erc721" && decodedLog.category === "transfer";
      const isErc1155 =
        decodedLog.type === "erc1155" && decodedLog.category === "transfer";

      if (!isErc721 && !isErc1155) {
        return [];
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
        const isBatchTransfer = decodedLog.eventName === "TransferBatch";
        const erc1155Metadata = isBatchTransfer
          ? decodedLog.args.ids.map((tokenId: string, i: number) => ({
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

        const numTokens = isBatchTransfer ? decodedLog.args.ids.length : 1;
        return new Array(numTokens).fill(activityItem);
      }
    });

    console.log(JSON.stringify(activity, null, 2));

    await next();
  }
);
