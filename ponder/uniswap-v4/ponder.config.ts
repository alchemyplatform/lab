import { createConfig } from "ponder";

import { PoolManagerAbi } from "./abis/PoolManagerAbi";
import { PositionManagerAbi } from "./abis/PositionManagerAbi";
import { EulerSwapAbi } from "./abis/EulerSwapAbi";

export default createConfig({
  chains: {
    base: { id: 8453, rpc: process.env.PONDER_RPC_URL_8453! }
  },
  contracts: {
    PoolManager: {
      abi: PoolManagerAbi,
      chain: {
        base: {
          address: "0x498581fF718922c3f8e6A244956aF099B2652b2b",
          startBlock: 25_350_988,
          // startBlock: "latest",
        }
      }
    },
    PositionManager: {
      abi: PositionManagerAbi,
      chain: {
        base: {
          address: "0x7c5f5a4bbd8fd63184577525326123b519429bdc",
          startBlock: 25_350_993,
        }
      }
    },
    EulerSwap: {
      abi: EulerSwapAbi,
      chain: {
        base: {
          address: "0xf0CFe22d23699ff1B2CFe6B8f706A6DB63911262",
          startBlock: 31_658_691,
        }
      }
    }
  },
});
