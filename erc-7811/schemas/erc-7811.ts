import {
  string,
  literal,
  union,
  object,
  optional,
  record,
  array,
  any,
  type InferInput,
  type InferOutput,
} from "valibot";
import { Address, Hex, Integer } from "./shared";

const AssetType = union([
  literal("native"),
  literal("erc20"),
  literal("erc721"),
  string()
])

const AddressOrNative = union([
  Address,
  literal("native")
])

const Eip155ChainId = Hex;

const AssetFilter = record(Eip155ChainId, array(object({
  address: AddressOrNative,
  type: AssetType
})));

const AssetTypeFilter = array(AssetType);

type WalletGetAssetsRequest = InferInput<typeof WalletGetAssetsRequest>;
const WalletGetAssetsRequest = object({
  account: Address,
  assetFilter: optional(AssetFilter),
  assetTypeFilter: optional(AssetTypeFilter),
  chainFilter: optional(array(Eip155ChainId))
})

// const Asset = object({
//   address: AddressOrNative,
//   balance: Hex,
//   type: AssetType,
//   metadata: any(),
// });

type NativeAsset = InferOutput<typeof NativeAsset>;
const NativeAsset = object({
  address: literal("native"),
  balance: Hex,
  type: literal("native"),
});

type Erc20Asset = InferOutput<typeof Erc20Asset>;
const Erc20Asset = object({
  address: Address,
  balance: Hex,
  type: literal("erc20"),
  metadata: object({
    name: string(),
    symbol: string(),
    decimals: Integer,
  })
});

type Erc721Asset = InferOutput<typeof Erc721Asset>;
const Erc721Asset = object({
  address: Address,
  // TODO: is balance always 1?
  balance: literal('0x1'),
  type: literal("erc721"),
  metadata: object({
    name: string(),
    symbol: string(),
    tokenId: Hex,
    tokenURI: optional(string()),
  })
});

const GenericAsset = object({
  address: Address,
  balance: Hex,
  type: string(),
  metadata: any(),
});

const Asset = union([NativeAsset, Erc20Asset, Erc721Asset, GenericAsset]);

type WalletGetAssetsResponse = InferOutput<typeof WalletGetAssetsResponse>;
const WalletGetAssetsResponse = record(Eip155ChainId, array(Asset));

export {
  NativeAsset,
  Erc20Asset,
  Erc721Asset,
  WalletGetAssetsRequest,
  type WalletGetAssetsResponse,
}