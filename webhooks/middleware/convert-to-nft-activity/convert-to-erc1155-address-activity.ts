import { toHex } from "npm:viem";
import type { DecodedLog } from "../../utils/events/decode.ts";
import type { NftActivityErc1155Transfer } from "../../utils/schemas/nft-activity.ts";

type ConvertToErc1155TransferActivityInput = {
  blockHash: string;
  blockNumber: number;
  // TODO: update log type
  log: any;
  // TODO: figure out if we want to decode log in this function directly
  decodedLog: DecodedLog;
};

export function convertToErc1155TransferActivity({
  blockHash,
  blockNumber,
  log,
  decodedLog,
}: ConvertToErc1155TransferActivityInput): NftActivityErc1155Transfer[] {
  // TODO: remove this check once we clean up types
  if (decodedLog.type !== "erc1155" && decodedLog.category !== "transfer") {
    throw new Error("Invalid decoded log");
  }

  const isBatchTransfer = decodedLog.eventName === "TransferBatch";

  if (!isBatchTransfer) {
    const erc1155Metadata = [
      {
        tokenId: toHex(decodedLog.args.id),
        value: toHex(decodedLog.args.value),
      },
    ];
    return [
      {
        fromAddress: decodedLog.args.from.toLowerCase(),
        toAddress: decodedLog.args.to.toLowerCase(),
        contractAddress: log.account.address,
        blockNum: toHex(blockNumber),
        hash: log.transaction.hash,
        category: "erc1155",
        erc1155Metadata,
        log: {
          address: log.account.address,
          topics: log.topics,
          data: log.data,
          blockNumber: toHex(blockNumber),
          transactionHash: log.transaction.hash,
          transactionIndex: toHex(log.transaction.index),
          blockHash,
          logIndex: toHex(log.index),
          // TODO: remove field below
          removed: false,
        },
      },
    ];
  }

  const erc1155Metadata = [
    {
      tokenId: toHex(decodedLog.args.id),
      value: toHex(decodedLog.args.value),
    },
  ];

  const activityItem = {
    fromAddress: decodedLog.args.from.toLowerCase(),
    toAddress: decodedLog.args.to.toLowerCase(),
    contractAddress: log.account.address,
    blockNum: toHex(blockNumber),
    hash: log.transaction.hash,
    category: "erc1155",
    erc1155Metadata,
    log: {
      address: log.account.address,
      topics: log.topics,
      data: log.data,
      blockNumber: toHex(blockNumber),
      transactionHash: log.transaction.hash,
      transactionIndex: toHex(log.transaction.index),
      blockHash,
      logIndex: toHex(log.index),
      // TODO: remove field below
      removed: false,
    },
  };

  const numTokens = decodedLog.args.ids.length;
  return new Array(numTokens).fill(activityItem);
}
