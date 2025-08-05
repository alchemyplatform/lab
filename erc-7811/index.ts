import { parse } from "valibot";
import { WalletGetAssetsRequest, type WalletGetAssetsResponse } from "./schemas";


const chainIdToNetwork = new Map<string, string>([
  ["0x1", "ethereum-mainnet"],
  ["0xa", "sepolia"],
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
  }
}




// vitalik.eth
const account = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

const results = await getAssets({
  "account": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "assetFilter": {
    "0x1": [
      {
        "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        "type": "erc20"
      },
      {
        "address": "native",
        "type": "native"
      }
    ],
    "0xa": [
      {
        "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        "type": "erc20"
      }
    ]
  },
  // "assetTypeFilter": ["erc20", "native"],
  // "chainFilter": ["0x1"]
});
console.log(`Results: ${JSON.stringify(results, null, 2)}`);
