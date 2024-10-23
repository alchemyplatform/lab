/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/create-custom-webhook-variable
 */
import { strictObject, type InferInput } from "@valibot/valibot";
import { Variable, VariableItems } from "./shared.ts";

export type RequestCreateVariable = InferInput<typeof RequestCreateVariable>;
export const RequestCreateVariable = strictObject({
  variable: Variable,
  items: VariableItems,
});

export const ResponseCreateVariable = strictObject({});
