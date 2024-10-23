/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/delete-custom-webhook-variable
 */
import { strictObject, type InferInput } from "@valibot/valibot";
import { Variable } from "./shared.ts";

export type RequestDeleteVariable = InferInput<typeof RequestDeleteVariable>;
export const RequestDeleteVariable = strictObject({
  variable: Variable,
});

// TODO: refactor schemas as EmptyObject?
export const ResponseDeleteVariable = strictObject({});
