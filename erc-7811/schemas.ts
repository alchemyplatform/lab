import {
  pipe,
  string,
  hexadecimal,
  length,
  literal,
  union,
  object,
  optional,
  record,
  array,
  any,
  number,
  integer,
  type InferInput,
  type InferOutput,
} from "valibot";


const Hex = pipe(
  string(),
  hexadecimal("The value is not a hexadecimal string.")
);

const Address = pipe(
  Hex,
  length(42, "The address is not 42 characters long.")
);

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

const NativeAsset = object({
  address: literal("native"),
  balance: Hex,
  type: literal("native"),
});

const Erc20Asset = object({
  address: Address,
  balance: Hex,
  type: literal("erc20"),
  metadata: object({
    name: string(),
    symbol: string(),
    decimals: pipe(number(), integer()),
  })
});

const Erc721Asset = object({
  address: Address,
  balance: Hex,
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
  WalletGetAssetsRequest,
  type WalletGetAssetsResponse,
}