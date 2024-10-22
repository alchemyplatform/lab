/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/update-webhook
 */
import { boolean, strictObject, type InferInput } from "@valibot/valibot";
import { WebhookId } from "../shared.ts";
import { Webhook } from "./shared.ts";

export type RequestUpdateStatus = InferInput<typeof RequestUpdateStatus>;
export const RequestUpdateStatus = strictObject({
  webhookId: WebhookId,
  isActive: boolean(),
});

export const ResponseUpdateStatus = strictObject({
  data: Webhook,
});
