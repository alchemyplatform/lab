/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/webhook-addresses
 */
import { array, strictObject, type InferInput } from "@valibot/valibot";
import { Address, Integer, WebhookId } from "../shared.ts";
import { PaginationAfter, PaginationLimit } from "./shared.ts";

export type RequestGetAllAddresses = InferInput<typeof RequestGetAllAddresses>;
export const RequestGetAllAddresses = strictObject({
  webhookId: WebhookId,
  limit: PaginationLimit,
  after: PaginationAfter,
});

export const ResponseGetAllAddresses = strictObject({
  data: array(Address),
  pagination: strictObject({
    cursors: strictObject({
      after: PaginationAfter,
    }),
    // TODO: check if total_count can be 0
    total_count: Integer,
  }),
});
