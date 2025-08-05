import {
  object,
  array,
  string,
  boolean,
  optional,
  pipe,
  maxLength
} from "valibot";
import { Address, Hex, Network } from "../shared";

/*
  Token Balances by Wallet

  https://www.alchemy.com/docs/data/portfolio-apis/portfolio-api-endpoints/portfolio-api-endpoints/get-token-balances-by-address
*/

// Request schema for get-token-balances-by-address
const GetTokenBalancesByAddressRequest = object({
  addresses: pipe(array(
    object({
      address: Address,
      networks: pipe(array(Network), maxLength(20, "Max 20 networks allowed.")),
    })
  ), maxLength(3, "Max 3 pairs of address and networks are allowed.")),
  includeNativeTokens: optional(boolean(), true), // default: true
  includeErc20Tokens: optional(boolean(), true),  // default: true
  pageKey: optional(string()),
});

// Response schema for get-token-balances-by-address
const TokenBalance = object({
  network: Network,
  address: Address,
  tokenAddress: Address,
  tokenBalance: Hex,
});

const GetTokenBalancesByAddressResponse = object({
  data: object({
    tokens: array(TokenBalance),
    pageKey: optional(string()),
  }),
});

export {
  GetTokenBalancesByAddressRequest,
  GetTokenBalancesByAddressResponse,
};
