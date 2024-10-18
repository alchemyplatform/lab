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

### validateSignature

### validatePayload

### transformPayload

### superWebhook

## Utils

### events

### schemas

## CLI

> Coming soon! 👨‍💻
