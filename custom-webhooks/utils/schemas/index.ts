import { variant, type InferOutput } from "@valibot/valibot";
import { GraphQlSchema } from "./custom.ts";
import { AddressActivitySchema } from "./address-activity.ts";
import { NftActivitySchema } from "./nft-activity.ts";

export type AlchemyPayloadSchema = InferOutput<typeof AlchemyPayloadSchema>;

export const AlchemyPayloadSchema = variant("type", [
  GraphQlSchema,
  AddressActivitySchema,
  NftActivitySchema,
]);
