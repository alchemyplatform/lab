import {
  string,
  literal,
  union,
  optional,
  record,
  array,
  any,
  type InferInput,
  type InferOutput,
  strictObject,
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

const AssetFilter = record(Eip155ChainId, array(strictObject({
  address: AddressOrNative,
  type: AssetType
})));

const AssetTypeFilter = array(AssetType);

type WalletGetAssetsRequest = InferInput<typeof WalletGetAssetsRequest>;
const WalletGetAssetsRequest = strictObject({
  account: Address,
  assetFilter: optional(AssetFilter),
  assetTypeFilter: optional(AssetTypeFilter),
  chainFilter: optional(array(Eip155ChainId))
})

// const Asset = strictObject({
//   address: AddressOrNative,
//   balance: Hex,
//   type: AssetType,
//   metadata: any(),
// });

type NativeAsset = InferOutput<typeof NativeAsset>;
const NativeAsset = strictObject({
  address: literal("native"),
  balance: Hex,
  type: literal("native"),
});

type Erc20Asset = InferOutput<typeof Erc20Asset>;
const Erc20Asset = strictObject({
  address: Address,
  balance: Hex,
  type: literal("erc20"),
  metadata: strictObject({
    name: string(),
    symbol: string(),
    decimals: Integer,
  })
});

type Erc721Asset = InferOutput<typeof Erc721Asset>;
const Erc721Asset = strictObject({
  address: Address,
  // TODO: is balance always 1?
  balance: literal('0x1'),
  type: literal("erc721"),
  metadata: strictObject({
    name: string(),
    symbol: string(),
    tokenId: Hex,
    tokenURI: optional(string()),
  })
});

type GenericAsset = InferOutput<typeof GenericAsset>;
const GenericAsset = strictObject({
  address: Address,
  balance: Hex,
  type: string(),
  metadata: any(),
});

const Asset = union([NativeAsset, Erc20Asset, Erc721Asset, GenericAsset]);

type WalletGetAssetsResponse = InferOutput<typeof WalletGetAssetsResponse>;
const WalletGetAssetsResponse = record(Eip155ChainId, array(Asset));

export {
  type NativeAsset,
  type Erc20Asset,
  type Erc721Asset,
  type GenericAsset,
  WalletGetAssetsRequest,
  type WalletGetAssetsResponse,
}