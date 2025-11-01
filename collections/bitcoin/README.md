# Bitcoin RPC Collection

A comprehensive Bruno collection for Bitcoin Core RPC API requests based on the [Bitcoin Core RPC API Reference](https://developer.bitcoin.org/reference/rpc/).

## Overview

This collection contains **16 essential Bitcoin Core RPC methods** covering blockchain operations, network monitoring, transaction handling, mining, and utility functions.

## Available Methods (16)

### Blockchain RPCs (4)
- `getbestblockhash` - Get the hash of the best block
- `getblock` - Get block information by hash
- `getblockcount` - Get current blockchain height
- `getblockchaininfo` - Get comprehensive blockchain state info

### Network RPCs (3)
- `getnetworkinfo` - Get P2P networking information
- `getpeerinfo` - Get data about connected peers
- `getconnectioncount` - Get number of peer connections

### Raw Transaction RPCs (3)
- `getrawtransaction` - Get raw transaction data by txid
- `sendrawtransaction` - Broadcast a raw transaction
- `decoderawtransaction` - Decode a raw transaction hex

### Mining RPCs (2)
- `getmininginfo` - Get mining-related information
- `getblocktemplate` - Get block template for mining

### Mempool RPCs (2)
- `getmempoolinfo` - Get memory pool statistics
- `getrawmempool` - Get all transactions in mempool

### Utility RPCs (2)
- `estimatesmartfee` - Estimate transaction fees
- `validateaddress` - Validate Bitcoin addresses

## Environment Configuration

The collection includes Bitcoin-specific environments:

- **Bitcoin-Mainnet**: `http://localhost:8332` (Bitcoin Core mainnet)
- **Bitcoin-Testnet**: `http://localhost:18332` (Bitcoin Core testnet)
- **Bitcoin-Regtest**: `http://localhost:18443` (Bitcoin Core regtest)

## Authentication

Bitcoin RPC requires HTTP Basic Authentication:

1. Configure `rpcUser` and `rpcPassword` in your environment
2. These correspond to `rpcuser` and `rpcpassword` in your `bitcoin.conf`
3. All requests use Basic Auth with these credentials

## Usage

1. Open this collection in Bruno
2. Select a Bitcoin environment (Mainnet, Testnet, or Regtest)
3. Configure your RPC credentials in the environment variables
4. Execute requests to interact with your Bitcoin node

## Usage Notes

- Bitcoin uses JSON-RPC 1.0 (not 2.0 like Ethereum)
- Replace sample transaction hashes and block hashes with real values
- Some methods require `txindex=1` in bitcoin.conf for full functionality
- Regtest environment is ideal for development and testing

---

Based on the official [Bitcoin Core RPC API Reference](https://developer.bitcoin.org/reference/rpc/).
