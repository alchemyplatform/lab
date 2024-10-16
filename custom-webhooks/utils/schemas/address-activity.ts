import {
  array,
  boolean,
  literal,
  null_,
  number,
  pipe,
  startsWith,
  strictObject,
  string,
  union,
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
  erc721TokenId: null_(),
  erc1155Metadata: null_(),
  asset: string(),
  category: literal("token"),
  rawContract: strictObject({
    rawValue: Hex,
    address: Address,
    decimals: Integer,
  }),
  typeTraceAddress: null_(),
  log: strictObject({
    address: Address,
    topics: array(Hex),
    data: Hex,
    blockNumber: Hex,
    transactionHash: Hash,
    transactionIndex: Hex,
    blockHash: Hash,
    logIndex: Hex,
    removed: literal(false),
  }),
});

const Erc721Transfer = strictObject({
  fromAddress: Address,
  toAddress: Address,
  blockNum: Hex,
  hash: Hash,
  erc721TokenId: Hex,
  category: literal("token"),
  rawContract: strictObject({
    rawValue: Hex,
    address: Address,
  }),
  log: strictObject({
    address: Address,
    topics: array(Hex),
    data: Hex,
    blockNumber: Hex,
    transactionHash: Hash,
    transactionIndex: Hex,
    blockHash: Hash,
    logIndex: Hex,
    removed: literal(false),
  }),
});

const Erc1155Transfer = strictObject({});

const Transfers = union([EthTransfer, InternalTransfer, Erc721Transfer]);

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

const json = {
  webhookId: "wh_rokqrknczin9mx28",
  id: "whevt_g14jx09a3lgbae7w",
  createdAt: "2024-10-16T14:23:03.058021513Z",
  type: "ADDRESS_ACTIVITY",
  event: {
    network: "ETH_SEPOLIA",
    activity: [
      {
        blockNum: "0xdf34a3",
        hash: "0x7a4a39da2a3fa1fc2ef88fd1eaea070286ed2aba21e0419dcfb6d5c5d9f02a72",
        fromAddress: "0x503828976d22510aad0201ac7ec88293211d23da",
        toAddress: "0xbe3f4b43db5eb49d1f48f53443b9abce45da3b79",
        value: 293.092129,
        erc721TokenId: null,
        erc1155Metadata: null,
        asset: "USDC",
        category: "token",
        rawContract: {
          rawValue:
            "0x0000000000000000000000000000000000000000000000000000000011783b21",
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          decimals: 6,
        },
        typeTraceAddress: null,
        log: {
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          topics: [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x000000000000000000000000503828976d22510aad0201ac7ec88293211d23da",
            "0x000000000000000000000000be3f4b43db5eb49d1f48f53443b9abce45da3b79",
          ],
          data: "0x0000000000000000000000000000000000000000000000000000000011783b21",
          blockNumber: "0xdf34a3",
          transactionHash:
            "0x7a4a39da2a3fa1fc2ef88fd1eaea070286ed2aba21e0419dcfb6d5c5d9f02a72",
          transactionIndex: "0x46",
          blockHash:
            "0xa99ec54413bd3db3f9bdb0c1ad3ab1400ee0ecefb47803e17f9d33bc4d0a1e91",
          logIndex: "0x6e",
          removed: false,
        },
      },
      {
        blockNum: "0xdf34a3",
        hash: "0xc84eeeb72d2b23161fd93b088f304902cbd8b4510f1455a65fdac160e37b3173",
        fromAddress: "0x71660c4005ba85c37ccec55d0c4493e66fe775d3",
        toAddress: "0x7853b3736edba9d7ce681f2a90264307694f97f2",
        value: 2400,
        erc721TokenId: null,
        erc1155Metadata: null,
        asset: "USDC",
        category: "token",
        rawContract: {
          rawValue:
            "0x000000000000000000000000000000000000000000000000000000008f0d1800",
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          decimals: 6,
        },
        typeTraceAddress: null,
        log: {
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          topics: [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x00000000000000000000000071660c4005ba85c37ccec55d0c4493e66fe775d3",
            "0x0000000000000000000000007853b3736edba9d7ce681f2a90264307694f97f2",
          ],
          data: "0x000000000000000000000000000000000000000000000000000000008f0d1800",
          blockNumber: "0xdf34a3",
          transactionHash:
            "0xc84eeeb72d2b23161fd93b088f304902cbd8b4510f1455a65fdac160e37b3173",
          transactionIndex: "0x48",
          blockHash:
            "0xa99ec54413bd3db3f9bdb0c1ad3ab1400ee0ecefb47803e17f9d33bc4d0a1e91",
          logIndex: "0x74",
          removed: false,
        },
      },
    ],
  },
};
