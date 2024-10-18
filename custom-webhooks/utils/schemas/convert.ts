import {
  array,
  literal,
  object,
  strictObject,
  union,
  type InferOutput,
} from "@valibot/valibot";
import {
  Hash,
  Hex,
  Id,
  Integer,
  IsoTimestamp,
  Network,
  Topics,
  WebhookId,
} from "./shared.ts";
import { Account, SequenceNumber } from "./custom.ts";

// Required fields to go from Custom webhook -> NFT Activity webhook
export const GraphQlToNftActivitySchema = strictObject(
  {
    webhookId: WebhookId,
    id: Id,
    createdAt: IsoTimestamp,
    type: literal("GRAPHQL"),
    event: strictObject({
      data: strictObject({
        block: object({
          number: Integer,
          hash: Hash,
          logs: array(
            object({
              index: Integer,
              account: Account,
              topics: Topics,
              data: union([Hex, literal("0x")]),
              transaction: object({
                hash: Hash,
                index: Integer,
              }),
            })
          ),
        }),
      }),
      sequenceNumber: SequenceNumber,
      network: Network,
    }),
  },
  "Required fields to go from Custom to NFT Activity webhook are missing."
);

// Required fields to go from Custom webhook -> Address Activity webhook
export const GraphQlToAddressActivitySchema = strictObject(
  {
    webhookId: WebhookId,
    id: Id,
    createdAt: IsoTimestamp,
    type: literal("GRAPHQL"),
    event: strictObject({
      data: strictObject({
        block: object({
          number: Integer,
          hash: Hash,
          logs: array(
            object({
              index: Integer,
              account: Account,
              topics: Topics,
              data: union([Hex, literal("0x")]),
              transaction: object({
                hash: Hash,
                index: Integer,
              }),
            })
          ),
        }),
      }),
      sequenceNumber: SequenceNumber,
      network: Network,
    }),
  },
  "Required fields to go from Custom to Address Activity webhook are missing."
);
