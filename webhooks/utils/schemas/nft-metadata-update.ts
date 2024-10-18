import {
  array,
  literal,
  number,
  object,
  optional,
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
  imageUri: Url,
  name: optional(string()),
  description: optional(string()),
  attributes: optional(
    array(
      object({
        traitType: string(),
        value: string(),
      })
    )
  ),
  rawMetadata: object({
    // Some optional fields to get you started
    name: optional(string()),
    image: optional(Url),
    description: optional(string()),
    attributes: optional(
      array(
        object({
          display_type: optional(
            union([
              literal("string"),
              literal("number"),
              literal("date"),
              literal("object"),
              string(),
            ])
          ),
          value: union([string(), number(), object({})]),
          trait_type: string(),
        })
      )
    ),
    version: optional(number()),
    url: optional(Url),
  }),
});

export const NftMetadataUpdateSchema = strictObject({
  webhookId: WebhookId,
  id: Id,
  createdAt: IsoTimestamp,
  type: literal("NFT_METADATA_UPDATE"),
  event: union([Event1, Event2]),
});
