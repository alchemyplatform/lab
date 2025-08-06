import { getAssets } from "../index";


// vitalik.eth
const account = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

const results = await getAssets({
  "account": account,
  "assetTypeFilter": ["erc20"],
  "chainFilter": ["0x1"]
});

console.log(`Results: ${JSON.stringify(results, null, 2)}`);