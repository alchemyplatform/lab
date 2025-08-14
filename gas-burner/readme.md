# Gas Burner

A tiny Solidity helper to burn a target amount of gas in a single call, without subcalls. Useful for gas metering tests, edge-case reproduction, and benchmarking.

> ⚠️ Exact equality is not guaranteed. Expect ±5–20 gas variation depending on client, compiler, and settings.

## Estimating gas with viem

```bash
bun run estimate-gas
```

See [`src/scripts/estimate-gas.ts`](./src/scripts/estimate-gas.ts) for more.

## Deployments

| Network         | Contract Address                             | Explorer                                                                                                 |
| --------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Botanix Testnet | `0x60a7e16fe32fe0daaf615d469a6f4e4fcb3774ed` | [View on BotanixScan](https://testnet.botanixscan.io/address/0x60a7E16fe32fE0Daaf615D469A6f4E4fCB3774Ed) |

### Deploying GasBurner contract to new chain

```bash
bun run deploy-contract
```

See [`src/scripts/deploy-contract`](.src/scripts/deploy-contract.ts) for more.

## How it works

Coarse burn: Loops with keccak256(0, 0) (~30 gas/iter) to get close to target without memory growth.

Fine burn: Closes the remaining gap with cheap ops (PUSH1 + POP, ~5 gas/iter).

We track used = start - gasleft() continuously until we reach toSpend gas.

### Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GasBurner {
    uint256 private constant COARSE_HEADROOM = 40; // adjust for accuracy
    event Burned(uint256 requested, uint256 used);

    function burnInternal(uint256 toSpend) external returns (uint256 used) {
        uint256 start = gasleft();
        while (start - gasleft() + COARSE_HEADROOM < toSpend) {
            assembly { pop(keccak256(0, 0)) }
        }
        while (start - gasleft() < toSpend) {
            assembly { pop(1) }
        }
        used = start - gasleft();
        emit Burned(toSpend, used);
    }
}
```

### Tuning

- Pin solc and optimizer settings.
- Adjust COARSE_HEADROOM if consistently over/undershooting.
- Avoid memory writes to keep costs stable.
