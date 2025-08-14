import { baseSepolia, botanixTestnet, sepolia } from "viem/chains";

// TODO: Update networks with GasBurner contract address
export const networkToGasBurnerContractAddress = new Map<string, string>([
  [baseSepolia.name, '0x60a7e16fe32fe0daaf615d469a6f4e4fcb3774ed'],
  [botanixTestnet.name, '0x9a7df6a33ab18f17cc93d931311bc0b90269fe53'],
  [sepolia.name, '0x9a7df6a33ab18f17cc93d931311bc0b90269fe53'],
]);