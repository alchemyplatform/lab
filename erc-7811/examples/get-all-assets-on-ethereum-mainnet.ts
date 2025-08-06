import { getAssets } from "../index";
import { writeFileSync } from "fs";

// vitalik.eth
const account = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

const results = await getAssets({
  "account": account,
  "chainFilter": ["0x1"],
});

console.log(`Results: ${JSON.stringify(results, null, 2)}`);
writeFileSync("results.json", JSON.stringify(results, null, 2));