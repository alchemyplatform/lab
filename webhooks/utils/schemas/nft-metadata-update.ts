import {
  array,
  boolean,
  literal,
  number,
  strictObject,
  string,
  union,
} from "@valibot/valibot";
import {
  Address,
  Id,
  IsoTimestamp,
  Network,
  Url,
  WebhookId,
} from "./shared.ts";

const BaseEvent = strictObject({
  network: Network,
  contractAddress: Address,
  tokenId: string(),
  networkId: number(),
  metadataUri: Url,
  updatedAt: IsoTimestamp,
});

const Event1 = strictObject({
  ...BaseEvent.entries,
  rawMetadata: string(),
});

const Event2 = strictObject({
  ...BaseEvent.entries,
  name: string(),
  description: string(),
  imageUri: Url,
  attributes: array(
    strictObject({
      traitType: string(),
      value: string(),
    })
  ),
  rawMetadata: strictObject({
    background_image: Url,
    image: Url,
    last_request_date: number(),
    is_normalized: boolean(),
    image_url: Url,
    name: string(),
    description: string(),
    attributes: array(
      strictObject({
        display_type: string(),
        value: union([string(), number()]),
        trait_type: string(),
      })
    ),
    version: number(),
    url: Url,
  }),
});

export const NftMetadataUpdateSchema = strictObject({
  webhookId: WebhookId,
  id: Id,
  createdAt: IsoTimestamp,
  type: literal("NFT_METADATA_UPDATE"),
  event: union([Event1, Event2]),
});
