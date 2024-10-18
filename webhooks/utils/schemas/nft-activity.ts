import { array, literal, strictObject, variant } from "@valibot/valibot";
import {
  ActivityLog as Log,
  Id,
  IsoTimestamp,
  Network,
  WebhookId,
  Erc1155Metadata,
} from "./shared.ts";
import { Address } from "./shared.ts";
import { Hex } from "./shared.ts";
import { Hash } from "./shared.ts";

const Erc721Transfer = strictObject({
  fromAddress: Address,
  toAddress: Address,
  contractAddress: Address,
  blockNum: Hex,
  hash: Hash,
  erc721TokenId: Hex,
  category: literal("erc721"),
  log: Log,
});

const Erc1155Transfer = strictObject({
  fromAddress: Address,
  toAddress: Address,
  contractAddress: Address,
  blockNum: Hex,
  hash: Hash,
  erc1155Metadata: Erc1155Metadata,
  category: literal("erc1155"),
  log: Log,
});

const Transfers = variant("category", [Erc721Transfer, Erc1155Transfer]);

export const NftActivitySchema = strictObject({
  webhookId: WebhookId,
  id: Id,
  createdAt: IsoTimestamp,
  type: literal("NFT_ACTIVITY"),
  event: strictObject({
    network: Network,
    activity: array(Transfers),
  }),
});