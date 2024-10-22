/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/webhook-addresses
 */
import {
  array,
  maxValue,
  minLength,
  minValue,
  number,
  optional,
  pipe,
  strictObject,
  string,
  type InferInput,
} from "@valibot/valibot";
import { Address, Integer, WebhookId } from "../shared.ts";

export type RequestGetAllAddresses = InferInput<typeof RequestGetAllAddresses>;
export const RequestGetAllAddresses = strictObject({
  webhookId: WebhookId,
  // This validation is also done server side.
  // Limit needs to be between 1 and 100 (inclusive).
  limit: optional(
    pipe(
      number(),
      minValue(1, "Limit must be between 1 and 100."),
      maxValue(100, "Limit must be between 1 and 100.")
    ),
    100
  ),
  after: optional(pipe(string(), minLength(1))),
});

export const ResponseGetAllAddresses = strictObject({
  data: array(Address),
  pagination: strictObject({
    cursors: strictObject({
      after: optional(string()),
    }),
    total_count: Integer,
  }),
});
