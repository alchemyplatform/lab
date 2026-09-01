# Testing Data API Schemas

This directory contains Valibot schemas and tests for Data API request and
response payloads. The tests validate local JSON fixtures against the schemas so
we can catch differences between the documented API shape, internal service
responses, and the examples in this repo.

## Pre-requisites

Install Deno and confirm:
```bash
deno --version
```

## Run Fixture Tests

From this directory:

```bash
cd /Users/sean.sing/Development/lab/data-api
deno test --allow-read
```

To run only a specific schema test:

```bash
deno test --allow-read utils/schemas/portfolio/tokens-by-address.test.ts
```

These tests read files from their respective example `payloads/` and do not make network
calls.

## Run Live API Test

The live API test is skipped by default. To enable it, create a local `.env`
file:

```bash
cp .env.example .env
```

Then add your key:

```bash
ALCHEMY_API_KEY=your-api-key
```

Run the live test with Deno's `.env` loader:

```bash
deno test --env-file=.env --allow-env=ALCHEMY_API_KEY --allow-read --allow-net
```

The live test sends `payloads/portfolio/tokens-by-address/test-request.json` to
the Portfolio API and validates the response with
`TokensByAddressResponseSchema`.

Do not commit a real API key.
