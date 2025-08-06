import { getAssets } from "../index";


// vitalik.eth
const account = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

const results = await getAssets({
  "account": account,
  "assetFilter": {
    // chain id for ethereum mainnet
    "0x1": [
      {
        // USDC contract address on ethereum mainnet
        "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "type": "erc20"
      },
      {
        // USDG contract address on ethereum mainnet
        "address": "0xe343167631d89B6Ffc58B88d6b7fB0228795491D",
        "type": "erc20"
      }
    ],
    // chain id for base mainnet
    "0x2105": [
      {
        // USDC contract address on base mainnet
        "address": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "type": "erc20"
      }
      // USDG is not deployed on base mainnet
    ]
  }
});

console.log(`Results: ${JSON.stringify(results, null, 2)}`);