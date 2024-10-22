/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/webhook-nft-filters
 */
import { array, strictObject, type InferInput } from "@valibot/valibot";
import { PaginationAfter, PaginationLimit, ResNftFilter } from "./shared.ts";
import { Integer, WebhookId } from "../shared.ts";

export type RequestGetNftFilters = InferInput<typeof RequestGetNftFilters>;
export const RequestGetNftFilters = strictObject({
  webhookId: WebhookId,
  limit: PaginationLimit,
  after: PaginationAfter,
});

export const ResponseGetNftFilters = strictObject({
  data: array(ResNftFilter),
  pagination: strictObject({
    cursors: strictObject({
      after: PaginationAfter,
    }),
    // TODO: check if total_count can be 0
    total_count: Integer,
  }),
});
