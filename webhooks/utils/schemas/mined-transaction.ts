import { literal, strictObject, string } from "@valibot/valibot";
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
  type: Hex,
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
