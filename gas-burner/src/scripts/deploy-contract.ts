import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  defineChain,
} from "viem";
import { baseSepolia, botanixTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { BYTECODE } from "./utils/bytecode";

// (optional)Define custom/new chain
// const myChain = defineChain({
//   id: 12345,
//   name: "MyL2",
//   network: "myl2",
//   nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
//   rpcUrls: { default: { http: ["https://rpc.myl2.example"] } },
// });

const privateKey = process.env.PRIVATE_KEY! as `0x${string}`;

if (!privateKey) {
  throw new Error("PRIVATE_KEY is not set");
}

// TODO: update to network you want to deploy to
const network = botanixTestnet;

const account = privateKeyToAccount(privateKey);
const walletClient = createWalletClient({
  account,
  chain: network,
  transport: http(),
});
const publicClient = createPublicClient({
  chain: network,
  transport: http(),
});

const abi = parseAbi([
  "event Burned(uint256 requested, uint256 used)",
  "function burnInternal(uint256 toSpend) returns (uint256 used)",
]);


const bytecode = BYTECODE;
const hash = await walletClient.deployContract({ abi, bytecode, account });
const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log("Deployed at:", receipt.contractAddress);