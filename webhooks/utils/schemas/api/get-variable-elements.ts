/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/read-custom-webhook-variable
 */
import { array, strictObject, union, type InferInput } from "@valibot/valibot";
import { PaginationAfter, PaginationLimit, Variable } from "./shared.ts";
import { Address, Hash, Integer } from "../shared.ts";

export type RequestGetVariableElements = InferInput<
  typeof RequestGetVariableElements
>;
export const RequestGetVariableElements = strictObject({
  variable: Variable,
  limit: PaginationLimit,
  after: PaginationAfter,
});

export const ResponseGetVariableElements = strictObject({
  data: array(union([Address, Hash])),
  pagination: strictObject({
    cursors: strictObject({
      after: PaginationAfter,
    }),
    // TODO: create new schema Positive
    // TODO: check if total_count can be 0
    total_count: Integer,
  }),
});
