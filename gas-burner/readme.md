# Gas Burner

A tiny Solidity helper to burn a target amount of gas in a single call, without subcalls. Useful for gas metering tests, edge-case reproduction, and benchmarking.

> ⚠️ Exact equality is not guaranteed. Expect ±5–20 gas variation depending on client, compiler, and settings.

## How it works

Coarse burn: Loops with keccak256(0, 0) (~30 gas/iter) to get close to target without memory growth.

Fine burn: Closes the remaining gap with cheap ops (PUSH1 + POP, ~5 gas/iter).

We track used = start - gasleft() continuously until we reach toSpend gas.

## Contract

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

## Deploying to a new chain with viem

```typescript
import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  defineChain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

// Define custom/new chain
const myChain = defineChain({
  id: 12345,
  name: "MyL2",
  network: "myl2",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.myl2.example"] } },
});

const account = privateKeyToAccount(process.env.PRIV_KEY!);
const walletClient = createWalletClient({
  account,
  chain: myChain,
  transport: http(),
});
const publicClient = createPublicClient({ chain: myChain, transport: http() });

const abi = parseAbi([
  "event Burned(uint256 requested, uint256 used)",
  "function burnInternal(uint256 toSpend) returns (uint256 used)",
]);

const bytecode = "0x..."; // from your build output
const hash = await walletClient.deployContract({ abi, bytecode, account });
const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log("Deployed at:", receipt.contractAddress);
```

## Estimating gas with viem

```typescript
import { createPublicClient, http, parseAbi } from "viem";
import { sepolia } from "viem/chains";

const abi = parseAbi([
  "function burnInternal(uint256 toSpend) returns (uint256 used)",
]);

const publicClient = createPublicClient({ chain: sepolia, transport: http() });
const target = 12_345n;

const estimatedGas = await publicClient.estimateContractGas({
  abi,
  address: "0xYourContract",
  functionName: "burnInternal",
  args: [target],
  account: "0xYourAddress",
  blockTag: "pending",
});

console.log("Estimated gas:", estimatedGas.toString());
```

## Tuning

- Pin solc and optimizer settings.
- Adjust COARSE_HEADROOM if consistently over/undershooting.
- Avoid memory writes to keep costs stable.
