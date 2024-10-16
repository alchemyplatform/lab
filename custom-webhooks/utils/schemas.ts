import { literal, number, string } from "@valibot/valibot";
import { array } from "@valibot/valibot";
import { null_ } from "@valibot/valibot";
import { strictObject } from "@valibot/valibot";
import { Address, Hex, Id, IsoTimestamp, WebhookId } from "./schemas/shared.ts";

export const Log = strictObject({
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
