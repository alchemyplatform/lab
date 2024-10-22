import {
  array,
  hexadecimal,
  integer,
  isoTimestamp,
  length,
  literal,
  maxLength,
  number,
  pipe,
  startsWith,
  strictObject,
  string,
  union,
} from "@valibot/valibot";

export const Integer = pipe(number(), integer());

export const Hex = pipe(
  string(),
  hexadecimal("The value is not a hexadecimal string.")
);

export const Hash = pipe(
  Hex,
  length(66, "The hash is not 66 characters long.")
);

export const Address = pipe(
  Hex,
  length(42, "The address is not 42 characters long.")
);

// eg. wh_jjcyyktgh9m8x3hd
export const WebhookId = pipe(
  string(),
  startsWith("wh_", "The webhook ID does not start with 'wh_'."),
  length(19, "The webhook ID is not 18 characters long.")
);

// eg. whevt_dfi0wvt7nrzfpbzr
export const Id = pipe(
  string(),
  startsWith("whevt_", "The ID does not start with 'whevt_'."),
  length(22, "The ID is not 16 characters long.")
);

// eg. whsec_test
export const WebhookSigningKey = pipe(
  string(),
  startsWith("whsec_", "The webhook signing key does not start with 'whsec_'."),
  length(30, "The webhook signing key is not 30 characters long.")
);

export const WebhookTypeGraphQl = literal("GRAPHQL");
export const WebhookTypeAddressActivity = literal("ADDRESS_ACTIVITY");
export const WebhookTypeNftActivity = literal("NFT_ACTIVITY");
export const WebhookTypeNftMetadataUpdate = literal("NFT_METADATA_UPDATE");
export const WebhookTypeMinedTransaction = literal("MINED_TRANSACTION");
export const WebhookTypeDroppedTransaction = literal("DROPPED_TRANSACTION");

export const WebhookType = union([
  WebhookTypeGraphQl,
  WebhookTypeAddressActivity,
  WebhookTypeNftActivity,
  WebhookTypeNftMetadataUpdate,
  WebhookTypeMinedTransaction,
  WebhookTypeDroppedTransaction,
]);

export const WebhookVersion = union([literal("V2"), literal("V1")]);

export const IsoTimestamp = pipe(
  string(),
  isoTimestamp("The timestamp is badly formatted.")
);

export const Network = union([
  literal("ETH_MAINNET"),
  literal("ETH_SEPOLIA"),
  string(),
]);

export const Topics = pipe(
  array(Hex),
  maxLength(4, "The topics array has more than 4 elements.")
);

// used in both Address Activity and NFT Activity schemas
export const ActivityLog = strictObject({
  address: Address,
  topics: Topics,
  data: union([Hex, literal("0x")]),
  blockNumber: Hex,
  transactionHash: Hash,
  transactionIndex: Hex,
  blockHash: Hash,
  logIndex: Hex,
  removed: literal(false),
});

// used in both Address Activity and NFT Activity schemas
export const Erc1155Metadata = array(
  strictObject({
    tokenId: Hex,
    value: Hex,
  })
);

// Careful! - adding a Valibot action like url() will likely break schemas
export const Url = string();
