import {
  array,
  check,
  digits,
  literal,
  null_,
  nullable,
  object,
  optional,
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
  Topics,
  WebhookId,
} from "./shared.ts";

export const SequenceNumber = pipe(string(), digits());

export const Account = pipe(
  strictObject({
    address: Address,
  }),
  check(
    (input) => Object.keys(input).length > 0,
    "The account object must at least have one key."
  )
);

const BaseLog = pipe(
  strictObject({
    index: optional(Integer),
    account: optional(Account),
    topics: optional(Topics),
    data: optional(union([Hex, literal("0x")])),
  }),
  check(
    (input) => Object.keys(input).length > 0,
    "The log object must at least have one key."
  )
);

const BaseTransaction = pipe(
  strictObject({
    hash: optional(Hash),
    nonce: optional(Integer),
    index: optional(Integer),
    from: optional(Account),
    // Note - to will be null if contract is created
    to: optional(nullable(Account)),
    value: optional(Hex),
    gasPrice: optional(Hex),
    maxFeePerGas: optional(nullable(Hex)),
    maxPriorityFeePerGas: optional(nullable(Hex)),
    gas: optional(Integer),
    status: optional(union([literal(0), literal(1)])),
    gasUsed: optional(Integer),
    cumulativeGasUsed: optional(Integer),
    effectiveGasPrice: optional(Hex),
    // Note - createdContract will be null if to is not null
    createdContract: optional(nullable(Account)),
  }),
  check(
    (input) => Object.keys(input).length > 0,
    "The transaction object must at least have one key."
  )
);

const Log = pipe(
  strictObject({
    ...BaseLog.entries,
    transaction: optional(BaseTransaction),
  }),
  check(
    (input) => Object.keys(input).length > 0,
    "The log object must at least have one key."
  )
);

const Transaction = pipe(
  strictObject({
    ...BaseTransaction.entries,
    inputData: optional(union([Hex, literal("0x")])),
    logs: optional(array(BaseLog)),
    r: optional(Hex),
    s: optional(Hex),
    v: optional(Hex),
    type: optional(union([literal(0), literal(1), literal(2), literal(3)])),
    accessList: optional(
      nullable(
        array(
          pipe(
            strictObject({
              address: optional(Address),
              storageKeys: optional(array(Hex)),
            }),
            check(
              (input) => Object.keys(input).length > 0,
              "The accessList object must at least have one key (address or storageKeys)."
            )
          )
        )
      )
    ),
    block: optional(null_()),
  }),
  check(
    (input) => Object.keys(input).length > 0,
    "The transaction object must at least have one key."
  )
);

const CallTracerTrace = pipe(
  strictObject({
    from: optional(Account),
    to: optional(Account),
    type: optional(
      union([
        literal("CALL"),
        literal("STATICCALL"),
        literal("DELEGATECALL"),
        literal("CREATE"),
        literal("CREATE2"),
      ])
    ),
    input: optional(union([Hex, literal("0x")])),
    output: optional(nullable(Hex)),
    value: optional(nullable(Hex)),
    gas: optional(Hex),
    gasUsed: optional(Hex),
    error: optional(nullable(string())),
    revertReason: optional(nullable(string())),
    subtraceCount: optional(Integer),
    traceAddressPath: optional(array(Integer)),
  }),
  check(
    (input) => Object.keys(input).length > 0,
    "The call trace object must at least have one key."
  )
);

const Data = strictObject({
  block: pipe(
    strictObject(
      {
        number: optional(Integer),
        hash: optional(Hash),
        // TODO: update parent block schema
        parent: optional(object({})),
        nonce: optional(literal("0x0000000000000000")),
        transactionsRoot: optional(Hash),
        transactionCount: optional(Integer),
        stateRoot: optional(Hash),
        receiptsRoot: optional(Hash),
        gasLimit: optional(Integer),
        gasUsed: optional(Integer),
        baseFeePerGas: optional(Hex),
        timestamp: optional(Integer),
        logsBloom: optional(Hex),
        mixHash: optional(Hash),
        difficulty: optional(literal("0x0")),
        totalDifficulty: optional(Hex),
        transactions: optional(array(Transaction)),
        logs: optional(array(Log)),
        callTracerTraces: optional(array(CallTracerTrace)),
      },
      "Payload must contain a valid block object."
    ),
    check(
      (input) => Object.keys(input).length > 0,
      "The block object must at least have one key."
    )
  ),
});

export const GraphQlSchema = strictObject({
  webhookId: WebhookId,
  id: Id,
  createdAt: IsoTimestamp,
  type: literal("GRAPHQL"),
  event: strictObject({
    data: Data,
    sequenceNumber: SequenceNumber,
    network: Network,
  }),
});

// Note - this is workaround around bug on test payload
// Test payload for Custom webhook does not (yet!) contain the 'network' field.
export const GraphQlTestSchema = strictObject({
  webhookId: WebhookId,
  id: Id,
  createdAt: IsoTimestamp,
  type: literal("GRAPHQL"),
  event: strictObject({
    data: Data,
    sequenceNumber: SequenceNumber,
  }),
});
