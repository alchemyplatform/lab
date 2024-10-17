import {
  array,
  digits,
  literal,
  null_,
  nullable,
  object,
  pipe,
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

const Account = strictObject({
  address: Address,
});

const BaseLog = strictObject({
  index: Integer,
  account: Account,
  topics: array(Hex),
  data: union([Hex, literal("0x")]),
});

const BaseTransaction = strictObject({
  hash: Hash,
  nonce: Integer,
  index: Integer,
  from: Account,
  to: Account,
  value: Hex,
  gasPrice: Hex,
  maxFeePerGas: nullable(Hex),
  maxPriorityFeePerGas: nullable(Hex),
  gas: Integer,
  status: union([literal(0), literal(1)]),
  gasUsed: Integer,
  cumulativeGasUsed: Integer,
  effectiveGasPrice: Hex,
  createdContract: null_(),
});

const Log = strictObject({
  ...BaseLog.entries,
  transaction: BaseTransaction,
});

const Transaction = strictObject({
  ...BaseTransaction.entries,
  inputData: union([Hex, literal("0x")]),
  logs: array(BaseLog),
  r: Hex,
  s: Hex,
  v: Hex,
  type: union([literal(0), literal(1), literal(2), literal(3)]),
  accessList: nullable(
    array(
      strictObject({
        address: Address,
        storageKeys: array(Hex),
      })
    )
  ),
  block: null_(),
});

const CallTracerTrace = strictObject({
  from: Account,
  to: Account,
  type: union([
    literal("CALL"),
    literal("STATICCALL"),
    literal("DELEGATECALL"),
    literal("CREATE"),
  ]),
  input: union([Hex, literal("0x")]),
  output: nullable(Hex),
  value: nullable(Hex),
  gas: Hex,
  gasUsed: Hex,
  error: nullable(string()),
  revertReason: nullable(string()),
  subtraceCount: Integer,
  traceAddressPath: array(Integer),
});

export const CustomSchema = strictObject({
  webhookId: WebhookId,
  id: Id,
  createdAt: IsoTimestamp,
  type: literal("GRAPHQL"),
  event: strictObject({
    data: strictObject({
      block: strictObject({
        number: Integer,
        hash: Hash,
        // TODO: update parent block schema
        parent: object({}),
        nonce: literal("0x0000000000000000"),
        transactionsRoot: Hash,
        transactionCount: Integer,
        stateRoot: Hash,
        receiptsRoot: Hash,
        gasLimit: Integer,
        gasUsed: Integer,
        baseFeePerGas: Hex,
        timestamp: Integer,
        logsBloom: Hex,
        mixHash: Hash,
        difficulty: literal("0x0"),
        totalDifficulty: Hex,
        transactions: array(Transaction),
        logs: array(Log),
        callTracerTraces: array(CallTracerTrace),
      }),
    }),
    sequenceNumber: pipe(string(), digits()),
    network: Network,
  }),
});
