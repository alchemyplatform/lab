/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/update-webhook-addresses
 */
import {
  array,
  optional,
  strictObject,
  type InferInput,
} from "@valibot/valibot";
import { Address, WebhookId } from "../shared.ts";

export type RequestAddRemoveAddresses = InferInput<
  typeof RequestAddRemoveAddresses
>;
export const RequestAddRemoveAddresses = strictObject({
  webhookId: WebhookId,
  addressesToAdd: optional(array(Address), []),
  addressesToRemove: optional(array(Address), []),
});

export const ResponseAddRemoveAddresses = strictObject({});
