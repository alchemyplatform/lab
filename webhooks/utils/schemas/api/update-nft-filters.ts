/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/update-webhook-nft-filters
 */
import {
  array,
  optional,
  strictObject,
  type InferInput,
} from "@valibot/valibot";
import { WebhookId } from "../shared.ts";
import { NftFilter } from "./shared.ts";

export type RequestUpdateNftFilters = InferInput<
  typeof RequestUpdateNftFilters
>;
export const RequestUpdateNftFilters = strictObject({
  webhookId: WebhookId,
  nftFiltersToAdd: optional(array(NftFilter), []),
  nftFiltersToRemove: optional(array(NftFilter), []),
});

export const ResponseUpdateNftFilters = strictObject({});
