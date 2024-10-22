import { array, strictObject, type InferInput } from "@valibot/valibot";
import { Address, WebhookId } from "../shared.ts";

/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/replace-webhook-addresses
 */
export type RequestReplaceAddresses = InferInput<
  typeof RequestReplaceAddresses
>;
export const RequestReplaceAddresses = strictObject({
  webhookId: WebhookId,
  addresses: array(Address),
});

export const ResponseReplaceAddresses = strictObject({});
