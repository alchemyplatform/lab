/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/create-custom-webhook-variable
 */
import {
  array,
  maxLength,
  minLength,
  pipe,
  strictObject,
  union,
  type InferInput,
} from "@valibot/valibot";
import { Address, Hash } from "../shared.ts";
import { Variable } from "./shared.ts";

export type RequestCreateVariable = InferInput<typeof RequestCreateVariable>;
export const RequestCreateVariable = strictObject({
  variable: Variable,
  // TODO: add Byte32 schema? check if we can pass any string as items
  items: pipe(
    array(union([Address, Hash]), "Item must be a valid address or hash"),
    minLength(1, "'items' should at least have one element"),
    maxLength(
      10_000,
      "'items' should have at most 10,000 elements - you can call the API multiple times."
    )
  ),
});

export const ResponseCreateVariable = strictObject({});
