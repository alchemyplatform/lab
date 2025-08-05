import {
  object,
  array,
  string,
  boolean,
  optional,
  pipe,
  maxLength,
  nullable,
  type InferInput,
  isoTimestamp
} from "valibot";
import { Address, Hex, Integer, Network } from "../shared";

/*
  Tokens by Wallet

  https://www.alchemy.com/docs/data/portfolio-apis/portfolio-api-endpoints/portfolio-api-endpoints/get-tokens-by-address
*/

// Request schema for get-tokens-by-address
const GetTokensByAddressRequest = object({
  addresses: pipe(
    array(
      object({
        address: Address,
        networks: pipe(array(Network), maxLength(5, "Max 5 networks allowed per address.")),
      })
    ),
    maxLength(2, "Max 2 pairs of address and networks are allowed.")
  ),
  withMetadata: optional(boolean(), true),        // default: true
  withPrices: optional(boolean(), true),           // default: true
  includeNativeTokens: optional(boolean(), true),  // default: true
  includeErc20Tokens: optional(boolean(), true),   // default: true
  pageKey: optional(string()),
});

const TokenPrice = object({
  currency: string(),
  value: string(),
  lastUpdatedAt: pipe(string(), isoTimestamp("YYYY-MM-DDTHH:mm:ssZ")),
});

const TokenPrices = object({
  network: Network,
  address: Address,
  prices: array(TokenPrice),
  // TODO: update docs to set error as optional?
  error: string(),
});

const TokenMetadata = object({
  decimals: nullable(Integer),
  logo: nullable(string()),
  name: nullable(string()),
  symbol: nullable(string()),
});

// TODO: split Token into NativeToken and Erc20Token
type Token = InferInput<typeof Token>;
const Token = object({
  address: Address,
  network: Network,
  tokenAddress: Address,
  tokenBalance: Hex,
  tokenMetadata: nullable(TokenMetadata),
  tokenPrices: nullable(TokenPrices),
});

// Response schema for get-tokens-by-address
const GetTokensByAddressResponse = object({
  data: object({
    tokens: nullable(array(Token)),
    pageKey: nullable(string()),
  }),
});

export {
  Token,
  GetTokensByAddressRequest,
  GetTokensByAddressResponse,
};
