import {
  strictObject,
  array,
  string,
  boolean,
  optional,
  pipe,
  maxLength,
  nullable
} from "valibot";
import { Address, Hex, Network } from "../shared";

/*
  Token Balances by Wallet

  https://www.alchemy.com/docs/data/portfolio-apis/portfolio-api-endpoints/portfolio-api-endpoints/get-token-balances-by-address
*/

// Request schema for get-token-balances-by-address
const GetTokenBalancesByAddressRequest = strictObject({
  addresses: pipe(array(
    strictObject({
      address: Address,
      networks: pipe(array(Network), maxLength(20, "Max 20 networks allowed.")),
    })
  ), maxLength(3, "Max 3 pairs of address and networks are allowed.")),
  includeNativeTokens: optional(boolean(), true), // default: true
  includeErc20Tokens: optional(boolean(), true),  // default: true
  pageKey: optional(string()),
});

// Response schema for get-token-balances-by-address
const TokenBalance = strictObject({
  network: Network,
  address: Address,
  tokenAddress: Address,
  tokenBalance: Hex,
});

const GetTokenBalancesByAddressResponse = strictObject({
  data: strictObject({
    tokens: nullable(array(TokenBalance)),
    pageKey: nullable(string()),
  }),
});

export {
  GetTokenBalancesByAddressRequest,
  GetTokenBalancesByAddressResponse,
};
