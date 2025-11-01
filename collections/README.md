# Alchemy RPC Bruno Collections

**Pre-configured Bruno collections for all Alchemy-supported RPC methods** — ready to clone, import, and use immediately for testing and debugging Ethereum and Alchemy APIs.

This repository provides a complete, maintained set of Bruno API client collections for internal Alchemy engineers and team members to quickly test, debug, and explore:
- Core Ethereum JSON-RPC methods (`eth_*`)
- Advanced debugging and tracing APIs (`debug_*`, `trace_*`)
- Alchemy-exclusive enhanced APIs (`alchemy_*`)
- Portfolio and NFT APIs

**No setup required** — just clone, open in Bruno, add your API key, and start testing.

---

## Quick Start (3 Steps)

### 1. Clone the Repository
```bash
git clone https://github.com/alchemyplatform/lab.git
cd lab/collections
```

### 2. Open in Bruno
1. Launch the Bruno API client
2. Click **Open Collection**
3. Navigate to the `bru-collections/` directory in this repo
4. Select a collection folder (e.g., `eth/`, `alchemy/`, `debug/`)

Bruno will load all the RPC request examples for that collection.

### 3. Add Your Alchemy API Key
Each collection has an environment variable for your API key:

1. In Bruno, open the collection you want to use
2. Click the **Environment** tab
3. Set the `api_key` variable to your Alchemy API key:
   ```
   api_key: your-alchemy-api-key-here
   ```

All requests in the collection will now work with your API key. The URLs are configured like:
```
https://eth-mainnet.g.alchemy.com/v2/{{api_key}}
```

---

## What's Included

Every `.bru` file in this repository is a **fully functional RPC request** with:
- **Valid example parameters** — real-world values ready to use
- **Comprehensive documentation** — detailed descriptions, use cases, parameters, return values, and edge cases
- **Pre-configured URLs** — pointing to Alchemy endpoints
- **Organized by category** — grouped into logical collections

### Available Collections

| Collection | Location | Description |
|------------|----------|-------------|
| **eth** | `bru-collections/eth/` | Core Ethereum JSON-RPC methods (balance, transactions, blocks, logs, etc.) |
| **debug** | `bru-collections/debug/` | Debugging APIs for transaction tracing and state inspection |
| **trace** | `bru-collections/trace/` | Parity/OpenEthereum trace APIs for detailed execution analysis |
| **alchemy** | `bru-collections/alchemy/` | Alchemy-exclusive endpoints (Gas Manager, Token APIs, Simulation, Asset Transfers) |
| **portfolio** | `bru-collections/portfolio/` | Portfolio and NFT APIs for wallet and token data |

Each collection contains 10-50+ pre-built request examples.

---

## Staying Updated

New RPC methods, updated examples, and enhanced documentation are added regularly. To get the latest:

```bash
git pull
```

Bruno will automatically detect and load any new `.bru` files.

- New methods appear as new requests in your collections
- Updated examples and documentation are refreshed
- Your API key settings remain intact (stored locally by Bruno)

**Recommended:** Pull updates before important testing sessions to ensure you have the latest methods and examples.

---

## Using the Collections

### Testing Individual Methods
1. Navigate to any method in a collection (e.g., `eth_getBalance`)
2. Review the documentation in the request
3. Modify parameters as needed
4. Click **Send** to execute the request
5. Inspect the response

### Exploring Method Documentation
Each request includes rich inline documentation:
- **Description** — What the method does
- **Use cases** — When to use this method
- **Parameters** — Detailed parameter explanations
- **Returns** — What to expect in the response
- **Edge cases & notes** — Important considerations and gotchas

### Debugging and Development Workflows
- Test new features against Alchemy endpoints
- Debug transaction failures with `debug_traceTransaction`
- Analyze smart contract interactions with `trace_call`
- Simulate transactions before sending with `alchemy_simulateAssetChanges`
- Monitor token balances with `alchemy_getTokenBalances`

---

## For Maintainers: How Collections Are Generated

This repository uses an automated generation system to keep collections up-to-date and maintainable at scale.

### Architecture
Methods to be supported in collections can be defined in **`all-methods.json`** with minimal properties to allow for simple inclusion of new bru files

Example entry:
```json
{
  "eth_getBalance": {
    "params": ["0xd8dA6BF26964aF9D7eEd9e03e53415D37aA96045", "latest"],
    "description": "Returns the balance of an account at a given address..."
  }
}
```

### Generating Collections
The **`generate-bru-collections.ts`** script transforms this JSON into complete Bruno collections:

```bash
bun run generate-bru-collections.ts
```

This command:
1. Reads method definitions from `all-methods.json`
2. Generates `.bru` files for each RPC method
3. Organizes them by prefix into collection directories
4. Creates `collection.bru` and `bruno.json` configuration files
5. Includes all documentation, parameters, and examples

### Adding New Methods
To add support for new RPC methods:

1. Add the method definition to `all-methods.json`:
   ```json
   {
     "new_methodName": {
       "params": [...example params...],
       "description": "Detailed description with use cases..."
     }
   }
   ```

2. Run the generator:
   ```bash
   bun run generate-bru-collections.ts
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Add new_methodName support"
   git push
   ```

All engineers can now `git pull` to receive the new method.

### Updating Documentation
To improve documentation for existing methods:

1. Edit descriptions in `all-methods.json`
2. Re-run the generator to rebuild all `.bru` files
3. Commit and push changes

This approach ensures:
- **Single source of truth** — all methods defined in one place
- **Consistency** — uniform formatting and structure
- **Easy maintenance** — update once, regenerate all collections
- **Version control** — full history of changes
- **Team collaboration** — simple pull request workflow

---

## Benefits for Alchemy Engineers

- **Zero setup time** — Start testing RPC methods in under 2 minutes
- **Always up-to-date** — Simple `git pull` to get new methods and documentation
- **Comprehensive documentation** — Learn while you test, right in the request
- **Real-world examples** — All parameters use valid, meaningful values
- **Debug faster** — Pre-built requests for complex debugging methods
- **Share knowledge** — Easy to share specific requests with teammates
- **Reproducible testing** — Consistent request examples across the team

Perfect for:
- Testing new Alchemy features and endpoints
- Debugging customer issues
- Learning unfamiliar RPC methods
- Onboarding new engineers
- API exploration and experimentation
- Creating test scenarios for QA

---

## Contributing

Internal Alchemy engineers can contribute by:
1. Adding new method definitions to `all-methods.json` OR include only new methods (the generator upserts new methods)
2. Enhancing documentation for existing methods
3. Reporting issues or suggesting improvements
4. Sharing useful parameter combinations

This repository is maintained by the Alchemy Developer Experience team. For questions or support, reach out in #dev-experience.

---

## Summary

**For Engineers:**
- Clone > Open in Bruno > Add API key > Test
- `git pull` regularly to stay updated
- Explore 100+ pre-built RPC request examples

**For Maintainers:**
- Edit `all-methods.json` to add/update methods
- Run `generate-bru-collections.ts` to rebuild collections
- Commit and push for team-wide updates

This approach keeps Alchemy's RPC testing workflow **fast**, **consistent**, and **always current**.
