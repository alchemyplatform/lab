import { createMiddleware } from "@hono/hono/factory";
import type { Context } from "@hono/hono";
import type { AlchemyPayload } from "../../utils/schemas/index.ts";
import { parse } from "@valibot/valibot";
import { GraphQlToAddressActivitySchema } from "../../utils/schemas/convert.ts";
import { decodeLog } from "../../utils/events/decode.ts";
import { AddressActivitySchema } from "../../utils/schemas/address-activity.ts";
import { convertToErc20TransferActivity } from "./convert-to-erc20-transfer-activity.ts";
import { convertToErc721TransferActivity } from "./convert-to-erc721-transfer-activity.ts";
import { convertToErc1155TransferActivity } from "./convert-to-erc1155-transfer-activity.ts";

export const convertToAddressActivity = createMiddleware(
  async (
    ctx: Context<{
      Variables: {
        payload: AlchemyPayload;
      };
    }>,
    next
  ) => {
    const payload = parse(GraphQlToAddressActivitySchema, ctx.get("payload"));

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

        if (
          decodedLog.type === "erc721" &&
          decodedLog.category === "transfer"
        ) {
          return convertToErc721TransferActivity({
            blockHash,
            blockNumber,
            log,
            decodedLog,
          });
        }

        if (
          decodedLog.type === "erc1155" &&
          decodedLog.category === "transfer"
        ) {
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

    if (activity.length > 0) {
      const addressActivityPayload = {
        webhookId: payload.webhookId,
        id: payload.id,
        createdAt: payload.createdAt,
        type: "ADDRESS_ACTIVITY",
        event: {
          network: payload.event.network,
          activity,
        },
      };
      console.log(addressActivityPayload);

      const parsed = parse(AddressActivitySchema, addressActivityPayload);
      console.log("Valid Address Activity Payload:", parsed !== undefined);
    }

    await next();
  }
);
