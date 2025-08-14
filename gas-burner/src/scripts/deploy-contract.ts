import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  defineChain,
} from "viem";
import { botanixTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

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

const account = privateKeyToAccount(privateKey);
const walletClient = createWalletClient({
  account,
  chain: botanixTestnet,
  transport: http(),
});
const publicClient = createPublicClient({
  chain: botanixTestnet,
  transport: http(),
});

const abi = parseAbi([
  "event Burned(uint256 requested, uint256 used)",
  "function burnInternal(uint256 toSpend) returns (uint256 used)",
]);

// Generate bytecode at https://remix.ethereum.org/
const bytecode = '0x6080604052348015600e575f5ffd5b506102658061001c5f395ff3fe608060405234801561000f575f5ffd5b5060043610610029575f3560e01c8063df4fbfff1461002d575b5f5ffd5b61004760048036038101906100429190610122565b61005d565b604051610054919061015c565b60405180910390f35b5f5f5a90505b8260285a8361007291906101a2565b61007c91906101d5565b101561008b575f5f2050610063565b5b825a8261009991906101a2565b1061008c575a816100aa91906101a2565b91507fcec1bae6e024d929f2929f3478ce70f55f9c636c8ef7b5073a61d7c3a432451b83836040516100dd929190610208565b60405180910390a150919050565b5f5ffd5b5f819050919050565b610101816100ef565b811461010b575f5ffd5b50565b5f8135905061011c816100f8565b92915050565b5f60208284031215610137576101366100eb565b5b5f6101448482850161010e565b91505092915050565b610156816100ef565b82525050565b5f60208201905061016f5f83018461014d565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6101ac826100ef565b91506101b7836100ef565b92508282039050818111156101cf576101ce610175565b5b92915050565b5f6101df826100ef565b91506101ea836100ef565b925082820190508082111561020257610201610175565b5b92915050565b5f60408201905061021b5f83018561014d565b610228602083018461014d565b939250505056fea26469706673582212205722b0a51ee3504fcaac854b67a3e00db1fc1a17882794be8a7afc9a8b5b43e064736f6c634300081e0033';
const hash = await walletClient.deployContract({ abi, bytecode, account });
const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log("Deployed at:", receipt.contractAddress);