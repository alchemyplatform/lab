import { botanixTestnet } from "viem/chains";

// TODO: Update networks with GasBurner contract address
export const networkToGasBurnerContractAddress = new Map<string, string>([
  [botanixTestnet.name, '0xf337881430706c526cca7333a0b00cbe0d4d6bae']
]);