import { isoTimestamp, literal, number, pipe, string } from "@valibot/valibot";
import { array } from "@valibot/valibot";
import { hexadecimal } from "@valibot/valibot";
import { length } from "@valibot/valibot";
import { null_ } from "@valibot/valibot";
import { strictObject } from "@valibot/valibot";
import { startsWith } from "@valibot/valibot";

const Hex = pipe(
  string(),
  hexadecimal("The value is not a hexadecimal string.")
);

const Address = pipe(Hex, length(42, "The address is not 42 characters long."));

const Log = strictObject({
  account: strictObject({
    address: Address,
  }),
  topics: array(Hex),
  data: string(),
  index: number(),
  transaction: strictObject({
    block: null_(),
    hash: Hex,
    index: number(),
  }),
});

// eg. wh_jjcyyktgh9m8x3hd
const WebhookId = pipe(
  string(),
  startsWith("wh_", "The webhook ID does not start with 'wh_'."),
  length(19, "The webhook ID is not 18 characters long.")
);

// eg. whevt_dfi0wvt7nrzfpbzr
const Id = pipe(
  string(),
  startsWith("whevt_", "The ID does not start with 'whevt_'."),
  length(22, "The ID is not 16 characters long.")
);

const IsoTimestamp = pipe(
  string(),
  isoTimestamp("The timestamp is badly formatted.")
);

const WebhookType = literal("GRAPHQL");

export const Payload = strictObject({
  webhookId: WebhookId,
  id: Id,
  createdAt: IsoTimestamp,
  type: WebhookType,
  event: strictObject({
    data: strictObject({
      block: strictObject({
        number: number(),
        hash: Hex,
        logs: array(Log),
      }),
    }),
    sequenceNumber: string(),
    network: string(),
  }),
});

/*
  Test payload currently lacks some fields compared to actual payloads.
*/
export const TestPayload = strictObject({
  webhookId: WebhookId,
  id: Id,
  createdAt: IsoTimestamp,
  type: WebhookType,
  event: strictObject({
    data: strictObject({
      block: strictObject({
        number: number(),
        hash: Hex,
        logs: array(Log),
      }),
    }),
    sequenceNumber: string(),
  }),
});
