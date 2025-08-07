import { createConfig } from "ponder";

import { PoolManagerAbi } from "./abis/PoolManagerAbi";
import { PositionManagerAbi } from "./abis/PositionManagerAbi";
import { EulerSwapAbi } from "./abis/EulerSwapAbi";

export default createConfig({
  chains: { base: { id: 8453, rpc: process.env.PONDER_RPC_URL_8453! } },
  contracts: {
    PoolManager: {
      chain: "base",
      address: "0x498581fF718922c3f8e6A244956aF099B2652b2b",
      abi: PoolManagerAbi,
      // startBlock: 25_350_988,
      startBlock: "latest",
    },
    PositionManager: {
      chain: "base",
      address: "0x0000000000000000000000000000000000000000",
      abi: PositionManagerAbi,
      startBlock: "latest",
    },
    EulerSwap: {
      chain: "base",
      address: "0xf0CFe22d23699ff1B2CFe6B8f706A6DB63911262",
      abi: EulerSwapAbi,
      startBlock: 31_658_691,
    }
  },
});
