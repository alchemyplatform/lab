import { createPublicClient, http, parseAbi } from "viem";
import { botanixTestnet } from "viem/chains";
import { networkToGasBurnerContractAddress } from "./utils/contract-deployments";

const abi = parseAbi([
  "function burnInternal(uint256 toSpend) returns (uint256 used)",
]);

const publicClient = createPublicClient({ chain: botanixTestnet, transport: http() });

const network = botanixTestnet;

// TODO: Replace with actual contract address once deployed
const contractAddress = networkToGasBurnerContractAddress.get(network.name) as `0x${string}`;

if (!contractAddress) {
  throw new Error(`No contract address found for ${network.name}`);
}

// TODO: Replace with gas burn amount
const TARGET_GAS_BURN = 100_000n;

const estimatedGas = await publicClient.estimateContractGas({
  abi,
  address: contractAddress,
  functionName: "burnInternal",
  args: [TARGET_GAS_BURN],
});

console.log("Estimated gas:", estimatedGas.toString());