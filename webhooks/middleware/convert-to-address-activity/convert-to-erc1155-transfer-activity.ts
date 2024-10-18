import { toHex } from "npm:viem";
import type { DecodedLog } from "../../utils/events/decode.ts";
import type { AddressActivityErc1155Transfer } from "../../utils/schemas/address-activity.ts";

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
}: ConvertToErc1155TransferActivityInput): AddressActivityErc1155Transfer {
  // TODO: remove this check once we clean up types
  if (decodedLog.type !== "erc1155" && decodedLog.category !== "transfer") {
    throw new Error("Invalid decoded log");
  }

  return {
    fromAddress: decodedLog.args.from.toLowerCase(),
    toAddress: decodedLog.args.to.toLowerCase(),
    blockNum: toHex(blockNumber),
    hash: log.transaction.hash,
    // TODO: get token id and values from decoded log
    erc1155Metadata: [],
    category: "erc1155",
    rawContract: {
      rawValue: log.data,
      address: log.account.address,
    },
    log: {
      address: log.account.address,
      topics: log.topics,
      data: log.data,
      blockNumber: toHex(blockNumber),
      transactionHash: log.transaction.hash,
      transactionIndex: toHex(log.transaction.index),
      blockHash,
      logIndex: toHex(log.index),
      removed: false,
    },
  };
}
