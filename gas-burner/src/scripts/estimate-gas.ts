import { createPublicClient, http, parseAbi } from "viem";
import { botanixTestnet } from "viem/chains";
import { networkToGasBurnerContractAddress } from "./utils/contract-deployments";

const nf = new Intl.NumberFormat('en-US');

const abi = parseAbi([
  "function burnInternal(uint256 toSpend) returns (uint256 used)",
]);

const publicClient = createPublicClient({ chain: botanixTestnet, transport: http() });

const network = botanixTestnet;

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


// TODO: Replace with actual contract address once deployed
const contractAddress = networkToGasBurnerContractAddress.get(network.name) as `0x${string}`;

if (!contractAddress) {
  throw new Error(`No contract address found for ${network.name}`);
}

// 0x60a7e16fe32fe0daaf615d469a6f4e4fcb3774ed
// 0xc0ec86363f891fdeb3cd50f14628b7a2b71ec08a
const estimatedGas = await publicClient.estimateContractGas({
  abi,
  address: '0x60a7e16fe32fe0daaf615d469a6f4e4fcb3774ed',
  functionName: "burnInternal",
  args: [targetGasBurn],
});


console.table([
  {
    Target: nf.format(targetGasBurn),
    'Estimated Gas': nf.format(estimatedGas),
    Delta: nf.format(estimatedGas - targetGasBurn),
    'Delta %': `${((Number(estimatedGas - targetGasBurn) / Number(targetGasBurn)) * 100).toFixed(2)}%`,
  }
])