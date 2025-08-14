import { botanixTestnet } from "viem/chains";

// TODO: Update networks with GasBurner contract address
export const networkToGasBurnerContractAddress = new Map<string, string>([
  [botanixTestnet.name, '0x60a7e16fe32fe0daaf615d469a6f4e4fcb3774ed']
]);