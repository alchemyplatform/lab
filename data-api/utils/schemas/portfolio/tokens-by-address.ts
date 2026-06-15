import {
  array,
  boolean,
  type InferInput,
  type InferOutput,
  isoTimestamp,
  null_,
  number,
  optional,
  pipe,
  strictObject,
  string,
  union,
} from "jsr:@valibot/valibot";

const WalletAddress = string();
const Network = string();

const AddressRequestSchema = strictObject({
  address: WalletAddress,
  networks: array(Network),
});

export const TokensByAddressRequestSchema = strictObject({
  addresses: array(
    AddressRequestSchema,
  ),
  withMetadata: optional(boolean()),
  withPrices: optional(boolean()),
  includeNativeTokens: optional(boolean()),
  includeErc20Tokens: optional(boolean()),
  pageKey: optional(string()),
});

const TokenMetadataSchema = strictObject({
  decimals: union([number(), null_()]),
  logo: union([string(), null_()]),
  name: union([string(), null_()]),
  symbol: union([string(), null_()]),
});

const TokenPriceSchema = strictObject({
  currency: string(),
  value: string(),
  // Check that it is a string, and ISO format
  lastUpdatedAt: pipe(string(), isoTimestamp()),
});

const TokenSchema = strictObject({
  network: Network,
  address: WalletAddress,
  tokenAddress: union([string(), null_()]),
  tokenBalance: union([string(), null_()]),
  tokenMetadata: optional(TokenMetadataSchema),
  tokenPrices: optional(array(TokenPriceSchema)),
});

export const TokensByAddressResponseSchema = strictObject({
  data: strictObject({
    tokens: array(TokenSchema),
    pageKey: union([string(), null_()]),
  })
});

export type TokensByAddressRequest = InferInput<
  typeof TokensByAddressRequestSchema
>;

export type TokensByAddressResponse = InferOutput<
  typeof TokensByAddressResponseSchema
>;
