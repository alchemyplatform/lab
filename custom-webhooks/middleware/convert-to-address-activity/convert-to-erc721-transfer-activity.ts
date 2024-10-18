import { toHex } from "npm:viem";
import type { DecodedLog } from "../../utils/events/decode.ts";
import type { AddressActivityErc721Transfer } from "../../utils/schemas/address-activity.ts";

type ConvertToErc721TransferActivityInput = {
  blockHash: string;
  blockNumber: number;
  // TODO: update log type
  log: any;
  // TODO: figure out if we want to decode log in this function directly
  decodedLog: DecodedLog;
};

export function convertToErc721TransferActivity({
  blockHash,
  blockNumber,
  log,
  decodedLog,
}: ConvertToErc721TransferActivityInput): AddressActivityErc721Transfer {
  // TODO: remove this check once we clean up types
  if (decodedLog.type !== "erc721" && decodedLog.category !== "transfer") {
    throw new Error("Invalid decoded log");
  }

  return {
    fromAddress: decodedLog.args.from.toLowerCase(),
    toAddress: decodedLog.args.to.toLowerCase(),
    blockNum: toHex(blockNumber),
    hash: log.transaction.hash,
    erc721TokenId: decodedLog.args.tokenId,
    category: "token",
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
