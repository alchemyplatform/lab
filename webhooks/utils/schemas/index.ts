import { variant, type InferOutput } from "@valibot/valibot";
import { GraphQlSchema } from "./custom.ts";
import { AddressActivitySchema } from "./address-activity.ts";
import { NftActivitySchema } from "./nft-activity.ts";
import { NftMetadataUpdateSchema } from "./nft-metadata-update.ts";
import { MinedTransactionSchema } from "./mined-transaction.ts";
import { DroppedTransactionSchema } from "./dropped-transaction.ts";

export type AlchemyPayload = InferOutput<typeof AlchemyPayloadSchema>;

export const AlchemyPayloadSchema = variant("type", [
  GraphQlSchema,
  AddressActivitySchema,
  NftActivitySchema,
  NftMetadataUpdateSchema,
  MinedTransactionSchema,
  DroppedTransactionSchema,
]);
