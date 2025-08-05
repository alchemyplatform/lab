import { parse } from "valibot";
import { WalletGetAssetsRequest, type WalletGetAssetsResponse } from "./schemas";
import { getTokenBalancesByAddress } from "./helpers/get-token-balances-by-address";
import { getNftsByAddress } from "./helpers/get-nfts-by-address";
import { getAssetsByAddress } from "./helpers/get-assets-by-address";


const chainIdToNetwork = new Map<string, string>([
  ["0x1", "eth-mainnet"],
  ["0xaa36a7", "eth-sepolia"],
  ["0xa4b1", "arb-mainnet"],
  ["0x66eee", "arb-sepolia"],
  ["0x2105", "base-mainnet"],
  ["0x14a33", "base-sepolia"],
  ["0x38", "bnb-mainnet"],
  ["0x61", "bnb-testnet"],
  ["0xa", "opt-mainnet"],
  ["0x1a4", "opt-sepolia"],
  ["0x89", "polygon-mainnet"],
  ["0x13882", "polygon-amoy"],
  ["0x144", "zksync-mainnet"],
  ["0x12c", "zksync-sepolia"],
  ["0xa86a", "avax-mainnet"],
  ["0xa869", "avax-fuji"],
  ["0x1389", "sonic-mainnet"],
  ["0x138a", "sonic-blaze"],
]);

async function getAssets(request: WalletGetAssetsRequest): Promise<WalletGetAssetsResponse> {
  const { account, assetFilter, assetTypeFilter, chainFilter } = parse(WalletGetAssetsRequest, request);

  if (assetFilter && (assetTypeFilter || chainFilter)) {
    throw new Error(`Cannot use assetFilter with assetTypeFilter or chainFilter.

If the assetFilter field is provided, the wallet MUST only return the assets specified within it, even if assetTypeFilter or chainFilter could have further filtered the result. 

This effectively disregards the assetTypeFilter and chainFilter fields entirely. The reason for this is that they are already implicitly defined within the assetFilter.

See https://eip.tools/eip/7811 for more details.`);
  }

  if (assetFilter) {
    for (const [chainId, assets] of Object.entries(assetFilter)) {
      console.log(chainId, assets);

      const network = chainIdToNetwork.get(chainId);
      if (!network) {
        throw new Error(`Portfolio API does not support chainId: ${chainId}.`);
      }
    }

    return {
      "0x1": [
        {
          "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          "balance": "0xcaaea35047fe5702",
          "type": "ERC20",
          "metadata": {
            "name": "Token",
            "symbol": "TOK",
            "decimals": 18
          }
        },
      ]
    };
  }

  /*
    assetTypeFilter is an OPTIONAL field that specifies an array of asset types, as defined in this ERC. If assetTypeFilter field is provided, wallet MUST include only assets with those types in the response.
  */
  if (assetTypeFilter) {

  }

  /*
    chainFilter is an OPTIONAL field that specifies an array of chain ids, where each value in the array MUST be a valid EIP-155 chainId.
  */
  if (chainFilter) {

  }

  /*
    If the assetFilter field is omitted, the wallet SHOULD return all available assets for the requested account. It is RECOMMENDED that the returned assets be ordered by estimated value in descending order, as determined by the wallet.
  */
  const assets = await getAssetsByAddress({ address: account, networks: ['eth-mainnet'] });
}


// vitalik.eth
const account = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

const results = await getAssets({
  "account": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  // "assetFilter": {
  //   "0x1": [
  //     {
  //       "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  //       "type": "erc20"
  //     },
  //     {
  //       "address": "native",
  //       "type": "native"
  //     }
  //   ],
  //   "0xa": [
  //     {
  //       "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  //       "type": "erc20"
  //     }
  //   ]
  // },
  // "assetTypeFilter": ["erc20", "native"],
  // "chainFilter": ["0x1"]
});
console.log(`Results: ${JSON.stringify(results, null, 2)}`);
