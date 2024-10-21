import { decodeLog } from "../../utils/events/decode.ts";
import type { GraphQlToNftActivity } from "../../utils/schemas/convert.ts";
import { convertToErc721TransferActivity } from "./convert-to-erc721-transfer-activity.ts";
import { convertToErc1155TransferActivity } from "./convert-to-erc1155-address-activity.ts";

export function convertLogsToTransferActivity(payload: GraphQlToNftActivity) {
  const {
    hash: blockHash,
    number: blockNumber,
    logs,
  } = payload.event.data.block;

  const activity = logs
    .map((log) => {
      const decodedLog = decodeLog(log);
      if (!decodedLog) {
        return [];
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

      return [];
    })
    .flat();

  return activity;
}
