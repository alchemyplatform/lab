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
  Address,
  Hash,
  Hex,
  Id,
  Integer,
  IsoTimestamp,
  Network,
  WebhookId,
} from "./shared.ts";

const Log = strictObject({
  address: Address,
  topics: array(Hex),
  data: union([Hex, literal("0x")]),
  blockNumber: Hex,
  transactionHash: Hash,
  transactionIndex: Hex,
  blockHash: Hash,
  logIndex: Hex,
  removed: literal(false),
});

const EthTransfer = strictObject({
  fromAddress: Address,
  toAddress: Address,
  blockNum: Hex,
  hash: Hash,
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
  fromAddress: Address,
  toAddress: Address,
  blockNum: Hex,
  hash: Hash,
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
  blockNum: Hex,
  hash: Hash,
  fromAddress: Address,
  toAddress: Address,
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
  fromAddress: Address,
  toAddress: Address,
  blockNum: Hex,
  hash: Hash,
  erc721TokenId: Hex,
  category: literal("token"),
  rawContract: strictObject({
    rawValue: union([Hex, literal("0x")]),
    address: Address,
  }),
  log: Log,
});

const Erc1155Transfer = strictObject({
  fromAddress: Address,
  toAddress: Address,
  blockNum: Hex,
  hash: Hash,
  erc1155Metadata: array(
    strictObject({
      tokenId: Hex,
      value: Hex,
    })
  ),
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
