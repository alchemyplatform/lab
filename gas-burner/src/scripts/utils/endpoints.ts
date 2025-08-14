import { baseSepolia, botanixTestnet, sepolia } from "viem/chains";

export const networkToEndpoint = new Map([
  [baseSepolia.name, `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`],
  [botanixTestnet.name, `https://botanix-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`],
  [sepolia.name, `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`],
]);