import { createMiddleware } from "@hono/hono/factory";
import type { Context } from "@hono/hono";
import type { AlchemyPayload } from "../../utils/schemas/index.ts";
import { parse } from "@valibot/valibot";
import { GraphQlToAddressActivitySchema } from "../../utils/schemas/convert.ts";
import { AddressActivitySchema } from "../../utils/schemas/address-activity.ts";
import { convertLogsToTransferActivity } from "./convert-logs-to-transfer-activity.ts";

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
    const activity = convertLogsToTransferActivity(payload);

    if (activity.length > 0) {
      const { webhookId, id, createdAt, event } = payload;
      const addressActivityPayload = {
        webhookId,
        id,
        createdAt,
        type: "ADDRESS_ACTIVITY",
        event: {
          network: event.network,
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
