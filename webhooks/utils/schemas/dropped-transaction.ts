import { literal, null_, strictObject, string } from "@valibot/valibot";
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
  blockHash: null_(),
  blockNumber: null_(),
  chainId: Hex,
  from: Address,
  gas: Hex,
  gasLimit: Hex,
  gasPrice: Hex,
  input: Hex,
  maxFeePerGas: Hex,
  maxPriorityFeePerGas: Hex,
  nonce: Hex,
  r: Hex,
  s: Hex,
  to: Address,
  transactionIndex: null_(),
  type: Hex,
  v: Hex,
  value: Hex,
});

export const DroppedTransactionSchema = strictObject({
  webhookId: WebhookId,
  id: Id,
  createdAt: IsoTimestamp,
  type: literal("DROPPED_TRANSACTION"),
  event: strictObject({
    appId: string(),
    network: Network,
    transaction: Transaction,
  }),
});
