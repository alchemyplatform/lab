# Gas Burner

A tiny Solidity helper to burn a target amount of gas in a single call, without subcalls. Useful for gas metering tests, edge-case reproduction, and benchmarking.

> ⚠️ Exact equality is not guaranteed. Expect ±5–20 gas variation depending on client, compiler, and settings.

## Estimating gas with viem

```bash
bun estimate-gas --gas=50000000
```

See [`src/scripts/estimate-gas.ts`](./src/scripts/estimate-gas.ts) for more.

## Deployments

| Network          | Contract Address                             | Explorer                                                                                                 |
| ---------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Base Sepolia     | `0x60a7e16fe32fe0daaf615d469a6f4e4fcb3774ed` | [View on BaseScan](https://sepolia.basescan.org/address/0x60a7e16fe32fe0daaf615d469a6f4e4fcb3774ed)      |
| Botanix Testnet  | `0x9a7df6a33ab18f17cc93d931311bc0b90269fe53` | [View on BotanixScan](https://testnet.botanixscan.io/address/0x9a7df6a33ab18f17cc93d931311bc0b90269fe53) |
| Ethereum Sepolia | `0x9a7df6a33ab18f17cc93d931311bc0b90269fe53` | [View on EtherScan](https://sepolia.etherscan.io/address/0x4b556af4343e0a2a23c29d9ef6e363fa69f6ba86)     |

### Deploying GasBurner contract to new chain

```bash
bun deploy-contract
```

See [`src/scripts/deploy-contract`](.src/scripts/deploy-contract.ts) for more.

## How it works

- Coarse burn: Loops with keccak256(0, 0) (~30 gas/iter) to get close to target without memory growth.

- Fine burn: Closes the remaining gap with cheap ops (PUSH1 + POP, ~5 gas/iter).

- We track used = start - gasleft() continuously until we reach toSpend gas.

### Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract GasBurner {
    uint256 private constant COARSE_HEADROOM = 100; // adjust for accuracy

    function burnInternal(uint256 toSpend) external view returns (uint256 used) {
        uint256 start = gasleft();
        while (start - gasleft() + COARSE_HEADROOM < toSpend) {
            assembly { pop(keccak256(0, 0)) }
        }
        while (start - gasleft() < toSpend) {
            assembly { pop(1) }
        }
        used = start - gasleft();
    }
}
```

### Tuning

- Pin solc and optimizer settings.
- Adjust COARSE_HEADROOM if consistently over/undershooting.
- Avoid memory writes to keep costs stable.
