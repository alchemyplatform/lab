import { toHex } from "npm:viem";
import type { DecodedLog } from "../../utils/events/decode.ts";
import type { AddressActivityErc20Transfer } from "../../utils/schemas/address-activity.ts";

type ConvertToErc20TransferActivityInput = {
  blockHash: string;
  blockNumber: number;
  // TODO: update log type
  log: any;
  // TODO: figure out if we want to decode log in this function directly
  decodedLog: DecodedLog;
};

export function convertToErc20TransferActivity({
  blockHash,
  blockNumber,
  log,
  decodedLog,
}: ConvertToErc20TransferActivityInput): AddressActivityErc20Transfer {
  // TODO: remove this check once we clean up types
  if (decodedLog.type !== "erc20" && decodedLog.category !== "transfer") {
    throw new Error("Invalid decoded log");
  }

  return {
    fromAddress: decodedLog.args.from.toLowerCase(),
    toAddress: decodedLog.args.to.toLowerCase(),
    blockNum: toHex(blockNumber),
    hash: log.transaction.hash,
    value: decodedLog.args.value,
    // TODO: call metadata endpoint
    asset: "",
    category: "token",
    rawContract: {
      rawValue: log.data,
      address: log.account.address,
      // TODO: call metadata endpoint to get decimals
      decimals: 18,
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
