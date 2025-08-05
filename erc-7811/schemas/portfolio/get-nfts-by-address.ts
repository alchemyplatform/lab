import {
  object,
  array,
  string,
  boolean,
  optional,
  pipe,
  maxLength,
  union,
  literal,
  nullable
} from "valibot";
import { Address, Integer, Network } from "../shared";

/*
  NFTs by Wallet

  https://www.alchemy.com/docs/data/portfolio-apis/portfolio-api-endpoints/portfolio-api-endpoints/get-nfts-by-address
*/

// Request schema for get-nfts-by-address
const GetNftsByAddressRequest = object({
  addresses: pipe(array(
    object({
      address: Address,
      networks: pipe(array(Network), maxLength(15, "Max 15 networks allowed.")),
    })
  ), maxLength(2, "Max 2 pairs of address and networks are allowed.")),
  withMetadata: optional(boolean(), true), // default: true
  pageKey: optional(string()),
  pageSize: optional(Integer, 100),
  orderBy: optional(union([literal('transferTime')])),
  sortOrder: optional(union([literal('asc'), literal('desc')])),
});

// NFT Contract schema
const NftContract = object({
  address: Address,
  name: optional(string()),
  symbol: optional(string()),
  totalSupply: optional(string()),
  tokenType: optional(string()),
  contractDeployer: optional(string()),
  deployedBlockNumber: optional(string()),
  openseaMetadata: optional(object({
    floorPrice: optional(string()),
    collectionName: optional(string()),
    safelistRequestStatus: optional(string()),
    imageUrl: optional(string()),
    description: optional(string()),
    externalUrl: optional(string()),
    twitterUsername: optional(string()),
    discordUrl: optional(string()),
    bannerImageUrl: optional(string()),
    lastIngestedAt: optional(string()),
  })),
});

// NFT Image schema
const NftImage = object({
  cachedUrl: optional(string()),
  thumbnailUrl: optional(string()),
  pngUrl: optional(string()),
  contentType: optional(string()),
  size: optional(string()),
  originalUrl: optional(string()),
});

// NFT Raw Metadata schema
const NftRawMetadata = object({
  tokenUri: optional(string()),
  metadata: optional(object({
    image: optional(string()),
    name: optional(string()),
    description: optional(string()),
    attributes: optional(array(object({
      value: optional(string()),
      trait_type: optional(string()),
    }))),
  })),
  error: optional(string()),
});

// NFT Collection schema
const NftCollection = object({
  name: optional(string()),
  slug: optional(string()),
  externalUrl: optional(string()),
  bannerImageUrl: optional(string()),
});

// NFT AcquiredAt schema
const NftAcquiredAt = object({
  blockTimestamp: optional(string()),
  blockNumber: optional(string()),
});

// Owned NFT schema
const OwnedNft = object({
  network: string(),
  address: string(),
  contract: NftContract,
  isSpam: optional(string()),
  spamClassifications: optional(array(string())),
  tokenId: string(),
  tokenType: string(),
  name: optional(string()),
  description: optional(string()),
  image: optional(NftImage),
  raw: optional(NftRawMetadata),
  collection: optional(NftCollection),
  tokenUri: optional(string()),
  timeLastUpdated: optional(string()),
  acquiredAt: optional(NftAcquiredAt),
});

// Response schema for get-nfts-by-address
const GetNftsByAddressResponse = object({
  data: object({
    ownedNfts: nullable(array(OwnedNft)),
    totalCount: nullable(Integer),
    pageKey: nullable(string()),
  }),
});

export {
  GetNftsByAddressRequest,
  GetNftsByAddressResponse,
};

