import {
  array,
  hexadecimal,
  integer,
  isoTimestamp,
  length,
  literal,
  maxLength,
  minLength,
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

export const IsoTimestamp = pipe(
  string(),
  isoTimestamp("The timestamp is badly formatted.")
);

export const Network = string();

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
