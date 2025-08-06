import { createConfig } from "ponder";

import { PoolManagerAbi } from "./abis/PoolManagerAbi";
import { PositionManagerAbi } from "./abis/PositionManagerAbi";

export default createConfig({
  chains: { base: { id: 8453, rpc: process.env.PONDER_RPC_URL_8453! } },
  contracts: {
    PoolManager: {
      chain: "base",
      address: "0x498581fF718922c3f8e6A244956aF099B2652b2b",
      abi: PoolManagerAbi,
      startBlock: 25350988,
    },
    PositionManager: {
      chain: "base",
      address: "0x7C5f5A4bBd8fD63184577525326123B519429bDc",
      abi: PositionManagerAbi,
      startBlock: 25350993,
    },
  },
});
