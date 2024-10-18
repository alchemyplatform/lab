import {
  array,
  literal,
  number,
  pipe,
  startsWith,
  strictObject,
  string,
  union,
  variant,
} from "@valibot/valibot";
import {
  ActivityLog as Log,
  Address,
  Hash,
  Hex,
  Id,
  Integer,
  IsoTimestamp,
  Network,
  WebhookId,
  Erc1155Metadata,
} from "./shared.ts";

const BaseTransfer = strictObject({
  fromAddress: Address,
  toAddress: Address,
  blockNum: Hex,
  hash: Hash,
});

const EthTransfer = strictObject({
  ...BaseTransfer.entries,
  value: number(),
  asset: literal("ETH"),
  category: literal("external"),
  rawContract: strictObject({
    rawValue: Hex,
    decimals: Integer,
  }),
});

// TODO: rename?
const InternalTransfer = strictObject({
  ...BaseTransfer.entries,
  value: number(),
  typeTraceAddress: union([
    pipe(string(), startsWith("CALL_")),
    pipe(string(), startsWith("DELEGATECALL_")),
    pipe(string(), startsWith("STATICCALL_")),
  ]),
  asset: string(),
  category: literal("internal"),
  rawContract: strictObject({
    rawValue: Hex,
    decimals: Integer,
  }),
});

const Erc20Transfer = strictObject({
  ...BaseTransfer.entries,
  value: number(),
  asset: string(),
  category: literal("token"),
  rawContract: strictObject({
    rawValue: Hex,
    address: Address,
    decimals: Integer,
  }),
  log: Log,
});

const Erc721Transfer = strictObject({
  ...BaseTransfer.entries,
  erc721TokenId: Hex,
  category: literal("token"),
  rawContract: strictObject({
    rawValue: union([Hex, literal("0x")]),
    address: Address,
  }),
  log: Log,
});

const Erc1155Transfer = strictObject({
  ...BaseTransfer.entries,
  erc1155Metadata: Erc1155Metadata,
  category: literal("erc1155"),
  rawContract: strictObject({
    rawValue: Hex,
    address: Address,
  }),
  log: Log,
});

const Transfers = variant("category", [
  EthTransfer,
  InternalTransfer,
  Erc20Transfer,
  Erc721Transfer,
  Erc1155Transfer,
]);

export const AddressActivitySchema = strictObject({
  webhookId: WebhookId,
  id: Id,
  createdAt: IsoTimestamp,
  type: literal("ADDRESS_ACTIVITY"),
  event: strictObject({
    network: Network,
    activity: array(Transfers),
  }),
});
