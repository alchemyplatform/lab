import { literal, strictObject, string, union } from "@valibot/valibot";
import {
  Address,
  Hash,
  Hex,
  Id,
  IsoTimestamp,
  Network,
  WebhookId,
} from "./shared.ts";

const Transaction = strictObject({
  hash: Hash,
  accessList: string(),
  blockHash: Hash,
  blockNumber: Hex,
  chainId: Hex,
  from: Address,
  gas: Hex,
  gasPrice: Hex,
  input: Hex,
  maxFeePerGas: Hex,
  maxPriorityFeePerGas: Hex,
  nonce: Hex,
  r: Hex,
  s: Hex,
  to: Address,
  transactionIndex: Hex,
  type: union([literal("0x0"), literal("0x1"), literal("0x2"), literal("0x3")]),
  v: Hex,
  value: Hex,
});

export const MinedTransactionSchema = strictObject({
  webhookId: WebhookId,
  id: Id,
  createdAt: IsoTimestamp,
  type: literal("MINED_TRANSACTION"),
  event: strictObject({
    appId: string(),
    network: Network,
    transaction: Transaction,
  }),
});
