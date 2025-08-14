import { createPublicClient, http, parseAbi } from "viem";
import { baseSepolia, botanixTestnet } from "viem/chains";
import { networkToGasBurnerContractAddress } from "./utils/contract-deployments";
import { networkToEndpoint } from "./utils/endpoints";

const nf = new Intl.NumberFormat('en-US');

const abi = parseAbi([
  "function burnInternal(uint256 toSpend) returns (uint256 used)",
]);



const args = process.argv.slice(2);

if (args.length !== 1) {
  throw new Error("Usage: bun run estimate-gas --gas=<target-gas-burn>");
}


if (typeof args[0] !== 'string') {
  throw new Error('Invalid argument: --gas=<target-gas-burn>');
}

let gasLimit = args[0].split('--gas=')[1];
if (!gasLimit) {
  console.log('No gas limit provided, using default of 10000000');
  gasLimit = '10000000';
}

const targetGasBurn = BigInt(gasLimit);
console.log(`Target gas burn: ${nf.format(targetGasBurn)}`);


const networks = [botanixTestnet, baseSepolia];

const results = [];

for (const network of networks) {
  const endpoint = networkToEndpoint.get(network.name);
  const publicClient = createPublicClient({
    chain: network,
    transport: http(endpoint)
  });

  // TODO: Replace with actual contract address once deployed
  const contractAddress = networkToGasBurnerContractAddress.get(network.name) as `0x${string}`;

  if (!contractAddress) {
    throw new Error(`No contract address found for ${network.name}`);
  }

  const estimatedGas = await publicClient.estimateContractGas({
    abi,
    address: contractAddress,
    functionName: "burnInternal",
    args: [targetGasBurn],
  });

  results.push({
    Network: network.name,
    'Estimated Gas': nf.format(estimatedGas),
    Delta: nf.format(estimatedGas - targetGasBurn),
    'Delta %': `${((Number(estimatedGas - targetGasBurn) / Number(targetGasBurn)) * 100).toFixed(2)}%`,
  });
}

console.table(results);