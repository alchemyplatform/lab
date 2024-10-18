import {
  literal,
  number,
  pipe,
  strictObject,
  string,
  url,
} from "@valibot/valibot";
import { Address, Id, IsoTimestamp, Network, WebhookId } from "./shared.ts";

export const NftMetadataUpdateSchema = strictObject({
  webhookId: WebhookId,
  id: Id,
  createdAt: IsoTimestamp,
  type: literal("NFT_METADATA_UPDATE"),
  event: strictObject({
    network: Network,
    contractAddress: Address,
    tokenId: string(),
    networkId: number(),
    metadataUri: pipe(string(), url()),
    updatedAt: IsoTimestamp,
    rawMetadata: string(),
  }),
});
