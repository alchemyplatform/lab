# Aptos API Collection

This collection contains API endpoints for interacting with the Aptos blockchain. Aptos is a Layer 1 blockchain built with the Move programming language, focusing on safety, scalability, and upgradeability.

## APIs Included

### 1. Full Node API (REST)

**Location**: `fullnode/`  
**Base URL**: `https://aptos-mainnet.g.alchemy.com/v2/{{api_key}}/v1/`  
**Type**: REST API  
**Documentation**: https://fullnode.mainnet.aptoslabs.com/v1/spec

The Full Node API provides direct access to Aptos blockchain data through REST endpoints. **27 endpoints included**.

**Accounts** (9 endpoints):
- Get account info and authentication key
- Get/query account resources (all or specific)
- Get/query account modules (all or specific)
- Get account balance for fungible assets
- Get account transactions (full or summaries)

**Blocks** (2 endpoints):
- Get blocks by height
- Get blocks by version (ledger version)

**Transactions** (8 endpoints):
- Get transactions (paginated list)
- Get transaction by hash or version
- Submit transaction (single or batch)
- Simulate transaction before submission
- Wait for transaction confirmation
- Encode transaction for signing
- Estimate gas prices

**Events** (2 endpoints):
- Get events by creation number
- Get events by event handle

**Tables** (2 endpoints):
- Get table item by key
- Get raw table item

**View Functions** (1 endpoint):
- Execute read-only Move functions without gas costs

**General** (3 endpoints):
- Get ledger info
- Health check
- Show OpenAPI specification

**Use Cases**:
- Submit transactions to the blockchain
- Query account balances and resources
- Simulate transactions before submission
- Check transaction status
- Read blockchain state via view functions
- Access on-chain events and table data

### 2. Indexer API (GraphQL)

**Location**: `indexer/`  
**Base URL**: `https://api.mainnet.aptoslabs.com/v1/graphql`  
**Type**: GraphQL API  
**Documentation**: https://aptos.dev/build/indexer

The Indexer API provides indexed and aggregated blockchain data through a GraphQL interface.

**Key Queries**:
- **Fungible Assets**: Query token balances and metadata
- **NFTs**: Get NFT collections and individual tokens
- **Account Transactions**: Historical transaction data
- **ANS (Aptos Name Service)**: Resolve human-readable names
- **Token Metadata**: Detailed token information
- **Staking**: Delegator and pool information

**Use Cases**:
- Get historical account activity
- Query NFT ownership and metadata
- Aggregate data across multiple accounts
- Build portfolio trackers
- Create NFT marketplaces
- Display user-friendly names (ANS)

**Advantages over Full Node API**:
- Aggregated historical data
- Complex queries with filtering and pagination
- No need to process raw blockchain data
- Optimized for common use cases

### 3. Transaction Stream API (gRPC)

**Location**: `txn-stream/`  
**Base URL**: `grpc.mainnet.aptoslabs.com:443`  
**Type**: gRPC Streaming API  
**Documentation**: https://aptos.dev/build/indexer/txn-stream

The Transaction Stream Service provides real-time streaming of transactions from the Aptos blockchain.

**Authentication**: Requires `x-aptos-data-authorization` header with API key. Contact Aptos Labs for access.

**Key Features**:
- Real-time transaction streaming
- Start from any ledger version (including genesis)
- Configurable batch sizes
- Server-streaming for continuous data flow

**Use Cases**:
- Build custom indexers
- Real-time transaction monitoring
- Event-driven applications
- Data pipelines for analytics
- Custom notification systems

**Advantages**:
- Lower latency than polling
- Efficient for processing large amounts of data
- Can replay historical transactions
- Used by the Aptos Indexer itself

## Network Information

### Mainnet (Alchemy)
- Full Node: `https://aptos-mainnet.g.alchemy.com/v2/{{api_key}}/v1/`
- Indexer: `https://api.mainnet.aptoslabs.com/v1/graphql`
- Transaction Stream: `grpc.mainnet.aptoslabs.com:443`
- Chain ID: 1

### Mainnet (Aptos Labs)
- Full Node: `https://fullnode.mainnet.aptoslabs.com/v1/`
- Indexer: `https://api.mainnet.aptoslabs.com/v1/graphql`
- Transaction Stream: `grpc.mainnet.aptoslabs.com:443`
- Chain ID: 1

### Testnet
- Full Node: `https://fullnode.testnet.aptoslabs.com/v1/`
- Indexer: `https://api.testnet.aptoslabs.com/v1/graphql`
- Transaction Stream: `grpc.testnet.aptoslabs.com:443`
- Chain ID: 2

### Devnet
- Full Node: `https://fullnode.devnet.aptoslabs.com/v1/`
- Indexer: `https://api.devnet.aptoslabs.com/v1/graphql`
- Transaction Stream: `grpc.devnet.aptoslabs.com:443`
- Chain ID: Dynamic

**Note**: The collection is configured to use Alchemy's endpoints by default. Update the URLs in individual .bru files if you want to use Aptos Labs endpoints directly.

## Quick Start

### Using the Full Node API

```bash
# Get ledger info
curl https://aptos-mainnet.g.alchemy.com/v2/YOUR_API_KEY/v1/

# Get account info
curl https://aptos-mainnet.g.alchemy.com/v2/YOUR_API_KEY/v1/accounts/0x1

# Get account balance for APT
curl https://aptos-mainnet.g.alchemy.com/v2/YOUR_API_KEY/v1/accounts/0x1/balance/0x1::aptos_coin::AptosCoin

# Execute a view function
curl -X POST https://aptos-mainnet.g.alchemy.com/v2/YOUR_API_KEY/v1/view \
  -H "Content-Type: application/json" \
  -d '{
    "function": "0x1::coin::balance",
    "type_arguments": ["0x1::aptos_coin::AptosCoin"],
    "arguments": ["0x1"]
  }'

# Estimate gas price
curl https://aptos-mainnet.g.alchemy.com/v2/YOUR_API_KEY/v1/estimate_gas_price
```

### Using the Indexer API

```bash
# Query fungible asset balances
curl -X POST https://api.mainnet.aptoslabs.com/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetBalances($address: String) { current_fungible_asset_balances(where: {owner_address: {_eq: $address}}) { asset_type amount } }",
    "variables": {"address": "0x1"}
  }'
```

### Using the Transaction Stream API

Requires gRPC client and authentication token. See the stream_transactions.bru file for example configuration.

## Common Patterns

### Checking Transaction Status

1. Submit transaction via Full Node API
2. Get transaction hash from response
3. Poll GET `/v1/transactions/by_hash/{hash}` until transaction is included
4. Check `success` field to verify execution

### Building a Token Portfolio

1. Use Indexer API to query `current_fungible_asset_balances`
2. For each asset, query `fungible_asset_metadata` for details
3. Display token name, symbol, and formatted balance

### Real-time Monitoring

1. Connect to Transaction Stream API
2. Specify starting version (or omit for latest)
3. Process transactions as they arrive
4. Filter for relevant events or addresses

## Resources

- **Aptos Documentation**: https://aptos.dev
- **Move Language Book**: https://move-language.github.io/move/
- **Aptos TypeScript SDK**: https://github.com/aptos-labs/aptos-ts-sdk
- **Aptos Explorer**: https://explorer.aptoslabs.com
- **Aptos Status**: https://status.aptoslabs.com

## Rate Limits

- Full Node API: Varies by provider (public endpoints may have limits)
- Indexer API: Subject to rate limiting on public endpoints
- Transaction Stream: Requires authentication; limits based on agreement

For production use, consider running your own Full Node or Indexer, or contact Aptos Labs for dedicated infrastructure.

## Support

- **Discord**: https://discord.gg/aptoslabs
- **Forum**: https://forum.aptoslabs.com
- **GitHub**: https://github.com/aptos-labs

