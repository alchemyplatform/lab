/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/update-webhook-nft-metadata-filters
 */
import {
  array,
  optional,
  strictObject,
  type InferInput,
} from "@valibot/valibot";
import { WebhookId } from "../shared.ts";
import { NftFilter } from "./shared.ts";

export type RequestUpdateNftMetadataFilters = InferInput<
  typeof RequestUpdateNftMetadataFilters
>;
export const RequestUpdateNftMetadataFilters = strictObject({
  webhookId: WebhookId,
  nftMetadataFiltersToAdd: optional(array(NftFilter), []),
  nftMetadataFiltersToRemove: optional(array(NftFilter), []),
});

export const ResponseUpdateNftMetadataFilters = strictObject({});
