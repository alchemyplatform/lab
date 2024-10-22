import { strictObject, type InferInput } from "@valibot/valibot";
import { WebhookId } from "../shared.ts";

export type RequestDeleteWebhook = InferInput<typeof RequestDeleteWebhook>;
export const RequestDeleteWebhook = strictObject({
  webhookId: WebhookId,
});

export const ResponseDeleteWebhook = strictObject({});
