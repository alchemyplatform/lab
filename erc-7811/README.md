# ERC-7811: Wallet Asset Discovery

ERC-7811 introduces a new RPC call, `wallet_getAssets`, for wallets to declare to the Dapp what assets are owned by the user. This allows for more accurate asset discovery and the use of assets that aren’t available on-chain but can be provided by the wallet.

## Alchemy Portolio APIs

Our Portfolio APIs offer a multi-chain way of fetching assets for a given address.

## Examples

### Get all assets across all networks

```json
{
  "account": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
}
```

### Get all assets on 1 network (Ethereum Mainnet)

```json
{
  "account": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "chainFilter": ["0x1"]
}
```

### Get native and ERC-20 assets across all networks

```json
{
  "account": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "assetTypeFilter": ["native", "erc20"]
}
```

### Get USDC and USDG assets across Ethereum and Base Mainnet

```json
{
  "account": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "assetFilter": {
    "0x1": [
      {
        // USDC contract address on ethereum mainnet
        "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "type": "erc20"
      },
      {
        // USDG contract address on ethereum mainnet
        "address": "0xe343167631d89B6Ffc58B88d6b7fB0228795491D",
        "type": "erc20"
      }
    ],
    // chain id for base mainnet
    "0x2105": [
      {
        // USDC contract address on base mainnet
        "address": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "type": "erc20"
      }
      // USDG is not deployed on base mainnet
    ]
  }
}
```
