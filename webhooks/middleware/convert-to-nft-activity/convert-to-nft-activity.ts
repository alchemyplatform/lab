import { createMiddleware } from "@hono/hono/factory";
import type { Context } from "@hono/hono";
import type { AlchemyPayload } from "../../utils/schemas/index.ts";
import { parse } from "@valibot/valibot";
import { GraphQlToNftActivitySchema } from "../../utils/schemas/convert.ts";
import { NftActivitySchema } from "../../utils/schemas/nft-activity.ts";
import { convertLogsToTransferActivity } from "./convert-logs-to-transfer-activity.ts";

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
    const activity = convertLogsToTransferActivity(payload);

    if (activity.length > 0) {
      const { webhookId, id, createdAt, event } = payload;
      const nftActivityPayload = {
        webhookId,
        id,
        createdAt,
        type: "NFT_ACTIVITY",
        event: {
          network: event.network,
          activity,
        },
      };
      console.log(nftActivityPayload);

      const parsed = parse(NftActivitySchema, nftActivityPayload);
      console.log("Valid NFT Activity Payload:", parsed !== undefined);
    }

    await next();
  }
);
