/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/update-custom-webhook-variable
 */
import { optional, strictObject, type InferInput } from "@valibot/valibot";
import { Variable, VariableItems } from "./shared.ts";

export type RequestUpdateVariable = InferInput<typeof RequestUpdateVariable>;
export const RequestUpdateVariable = strictObject({
  variable: Variable,
  itemsToAdd: optional(VariableItems),
  itemsToDelete: optional(VariableItems),
});

export const ResponseUpdateVariable = strictObject({});
