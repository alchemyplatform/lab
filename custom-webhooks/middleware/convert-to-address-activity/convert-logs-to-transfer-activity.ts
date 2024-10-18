import type { GraphQlToAddressActivity } from "../../utils/schemas/convert.ts";
import { convertToErc20TransferActivity } from "./convert-to-erc20-transfer-activity.ts";
import { convertToErc721TransferActivity } from "./convert-to-erc721-transfer-activity.ts";
import { convertToErc1155TransferActivity } from "./convert-to-erc1155-transfer-activity.ts";
import { decodeLog } from "../../utils/events/decode.ts";

export function convertLogsToTransferActivity(
  payload: GraphQlToAddressActivity
) {
  const {
    hash: blockHash,
    number: blockNumber,
    logs,
  } = payload.event.data.block;

  const activity = logs
    .map((log) => {
      const decodedLog = decodeLog(log);
      if (!decodedLog) {
        return null;
      }

      if (decodedLog.type === "erc20" && decodedLog.category === "transfer") {
        return convertToErc20TransferActivity({
          blockHash,
          blockNumber,
          log,
          decodedLog,
        });
      }

      if (decodedLog.type === "erc721" && decodedLog.category === "transfer") {
        return convertToErc721TransferActivity({
          blockHash,
          blockNumber,
          log,
          decodedLog,
        });
      }

      if (decodedLog.type === "erc1155" && decodedLog.category === "transfer") {
        return convertToErc1155TransferActivity({
          blockHash,
          blockNumber,
          log,
          decodedLog,
        });
      }

      return null;
    })
    .filter((item) => item !== null);

  return activity;
}
