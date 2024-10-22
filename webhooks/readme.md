# Webhooks

Webhooks allow teams to be notified about specific events happening on the blockchain.

We support 4 main webhook types today.

- [Custom]()
- [Address Activity]()
- [NFT Activity]()
- [NFT Metadata Update]()

We still maintain mined and dropped webhooks created before Aug 2024 (disallowing their creation).

- _(deprecated)_ [Mined Transaction]()
- _(deprecated)_ [Dropped Transaction]()

## Usage

### Start server

```bash
deno run --allow-net --allow-env --env --watch index.ts
```

## Middleware

We built a set of Hono middlewares to help you validate webhook signatures and payloads.

### _validateSignature_

- Validates webhook signature parsing the `X-Alchemy-Signature` header and a user provided signing secret.

- You can also pass a map of webhook ids to secrets to validate multiple webhook signatures.

### _validatePayload_

- Validates webhook payload against schemas defined in [`utils/schemas`](./utils/schemas).

- Main advantage is that you'll get access to a typed payload object in your handler. 🪄

- ⚠️ Test payloads will fail validation. They differ slightly from production payloads - we're working on a fix. In meantime, we would recommend testing with production payloads.

### _transformPayload_

_Most teams won't need to use this middleware._

- Transforms a Custom / GraphQL webhook payload into an Address Activity or NFT Activity payload.

- This can be useful if transitioning from Address Activity or NFT Activity webhooks to our new Custom webhooks and you want to keep your existing handlers.

### _superWebhook_

## Utils

### events

### schemas

Schemas to validate all Alchemy webhook payloads and check for required fields to transform Custom into Address Activity or NFT Activity webhook payloads.

## CLI

> Coming soon! 👨‍💻

## Examples

You'll find more than 20 examples to get you started.
If you can't find what you're looking for, feel free to create an issue.

- Track ALL ETH transfers (external)

- Track ALL ETH transfers FOR specific users

- Track ALL internal transactions

- Track ALL ERC20 events (_Transfer_, _Approval_)

- Track ALL ERC20 _Transfer_ events

- Track ERC20 _Transfer_ events FOR specific tokens (e.g. USDC)

- Track ERC20 _Transfer_ events FOR specific addresses

- Track ERC20 _Transfer_ events FOR specific tokens AND FOR specific addresses

- Track ALL NFT events (ERC721, ERC1155, CryptoKitties, CryptoPunks)

- Track ALL NFT _Transfer_ events (ERC721, ERC1155, CryptoKitties, CryptoPunks)

- Track ALL ERC721 events (_Transfer_, _Approval_, _ApprovalForAll_)

- Track ALL ERC721 _Transfer_ events

- Track ERC721 _Transfer_ events FOR specific tokens (e.g. Bored Ape Yacht Club)

- Track ERC721 _Transfer_ events FOR specific addresses

- Track ERC721 _Transfer_ events FOR specific tokens AND FOR specific addresses

- Track ALL ERC1155 events (_Transfer_, _Approval_, _ApprovalForAll_)

- Track ALL ERC1155 _Transfer_ events

- Track ERC1155 _Transfer_ events FOR specific tokens (e.g. Axie Infinity)

- Track ERC1155 _Transfer_ events FOR specific addresses

- Track ERC1155 _Transfer_ events FOR specific tokens AND FOR specific addresses

- Track ALL user operations

- Track user operations FOR specific users (i.e. sent by specific smart contract wallets)
