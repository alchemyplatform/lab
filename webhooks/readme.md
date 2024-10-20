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

### Create custom webhook

```bash
deno run --allow-env scripts/create-webhook.ts
```

## Middleware

We built a set of Hono middlewares to help you validate webhook signatures and payloads.

### validateSignature

- Validates webhook signature parsing the `X-Alchemy-Signature` header and a user provided signing secret.

- You can also pass a map of webhook ids to secrets to validate multiple webhook signatures.

### validatePayload

- Validates webhook payload against schemas defined in [`utils/schemas`](./utils/schemas).

- Main advantage is that you'll get access to a typed payload object in your handler. 🪄

### transformPayload

_Most teams won't need to use this middleware._

- Transforms a Custom / GraphQL webhook payload into an Address Activity or NFT Activity payload.

- This can be useful if transitioning from Address Activity or NFT Activity webhooks to our new Custom webhooks and you want to keep your existing handlers.

### superWebhook

## Utils

### events

### schemas

Schemas to validate all Alchemy webhook payloads and check for required fields to transform Custom into Address Activity or NFT Activity webhook payloads.

## CLI

> Coming soon! 👨‍💻
