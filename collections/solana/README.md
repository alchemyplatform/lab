# Solana RPC Collection

A comprehensive Bruno collection for Solana JSON-RPC API requests based on the [Solana RPC HTTP Methods](https://solana.com/docs/rpc/http) documentation.

## Overview

This collection contains **17 essential Solana RPC methods** covering account operations, blockchain queries, token management, and transaction handling for the Solana ecosystem.

## Available Methods (17)

### Account Methods (3)
- `getAccountInfo` - Get account data and metadata
- `getBalance` - Get account balance in lamports
- `getMultipleAccounts` - Get multiple account info efficiently

### Block & Transaction Methods (4)
- `getBlock` - Get confirmed block details
- `getBlockHeight` - Get current block height  
- `getLatestBlockhash` - Get latest blockhash for transactions
- `getTransaction` - Get transaction details by signature

### Network Methods (4)
- `getHealth` - Check node health status
- `getVersion` - Get Solana version information
- `getClusterNodes` - Get cluster node information
- `getEpochInfo` - Get current epoch information

### Token Methods (3)
- `getTokenAccountsByOwner` - Get SPL token accounts by owner
- `getTokenSupply` - Get total supply of SPL token
- `getProgramAccounts` - Get accounts owned by program

### Transaction Submission (3)
- `sendTransaction` - Submit signed transaction to cluster
- `simulateTransaction` - Simulate transaction execution
- `getSignatureStatuses` - Check transaction confirmation status

## Environment Configuration

The collection includes Solana-specific environments:

- **Mainnet**: `https://api.mainnet-beta.solana.com` (Solana mainnet)
- **Devnet**: `https://api.devnet.solana.com` (Solana devnet for development)
- **Testnet**: `https://api.testnet.solana.com` (Solana testnet)

## Solana-Specific Features

### Commitment Levels
- **finalized**: Maximum security, ~32 slots behind
- **confirmed**: Balance between speed and security, ~1 slot behind  
- **processed**: Fastest, but less secure

### Encoding Options
- **jsonParsed**: Human-readable format for supported account types
- **base64**: Raw account data as base64 string
- **base58**: Base58 encoded data

### Key Concepts
- **Lamports**: Smallest unit (1 SOL = 1,000,000,000 lamports)
- **Pubkey**: Base58-encoded Ed25519 public keys
- **Slots**: Solana's time unit for block production
- **Epochs**: Collection of slots for validator rotation

## Usage

1. Open this collection in Bruno
2. Select a Solana environment (Mainnet, Devnet, or Testnet)
3. Configure API endpoints (some providers require API keys)
4. Execute requests to interact with Solana network

## Usage Notes

- Solana uses JSON-RPC 2.0 protocol (same as Ethereum)
- Replace sample pubkeys and signatures with real values
- Use commitment levels appropriate for your use case
- Consider rate limits when using public RPC endpoints
- Devnet is recommended for development and testing

---

Based on the official [Solana RPC HTTP Methods](https://solana.com/docs/rpc/http) documentation.
