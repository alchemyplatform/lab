# Gas Burner

A tiny Solidity helper to burn a target amount of gas in a single call, without subcalls. Useful for gas metering tests, edge-case reproduction, and benchmarking.

> ⚠️ Exact equality is not guaranteed. Expect ±5–20 gas variation depending on client, compiler, and settings.

## Estimating gas with viem

```bash
bun run estimate-gas --gas=20000000
```

See [`src/scripts/estimate-gas.ts`](./src/scripts/estimate-gas.ts) for more.

## Deployments

| Network         | Contract Address                             | Explorer                                                                                                 |
| --------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Botanix Testnet | `0xf337881430706c526cca7333a0b00cbe0d4d6bae` | [View on BotanixScan](https://testnet.botanixscan.io/address/0xf337881430706c526cca7333a0b00cbe0d4d6bae) |

### Deploying GasBurner contract to new chain

```bash
bun run deploy-contract
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
