import {
  pipe,
  string,
  hexadecimal,
  length,
  union,
  literal,
  number,
  integer,
} from "valibot";

const Integer = pipe(
  number(),
  integer("The value is not an integer.")
);

const Hex = pipe(
  string(),
  hexadecimal("The value is not a hexadecimal string.")
);

const Address = pipe(
  Hex,
  length(42, "The address is not 42 characters long.")
);

// Supported networks for Alchemy Portfolio API
const Network = union([
  literal("eth-mainnet"),
  literal("eth-sepolia"),
  literal("arb-mainnet"),
  literal("arb-sepolia"),
  literal("avax-mainnet"),
  literal("avax-fuji"),
  literal("base-mainnet"),
  literal("base-sepolia"),
  literal("bnb-mainnet"),
  literal("bnb-testnet"),
  literal("opt-mainnet"),
  literal("opt-sepolia"),
  literal("polygon-mainnet"),
  literal("polygon-amoy"),
  literal("sonic-mainnet"),
  literal("sonic-blaze"),
  literal("zksync-mainnet"),
  literal("zksync-sepolia"),
])

export {
  Integer,
  Hex,
  Address,
  Network,
};