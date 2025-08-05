import {
  strictObject,
  array,
  string,
  boolean,
  optional,
  pipe,
  maxLength,
  union,
  literal,
  nullable,
  type InferOutput,
  isoTimestamp
} from "valibot";
import { Address, Hex, Integer, Network } from "../shared";

/*
  NFTs by Wallet

  https://www.alchemy.com/docs/data/portfolio-apis/portfolio-api-endpoints/portfolio-api-endpoints/get-nfts-by-address
*/

// Request schema for get-nfts-by-address
const GetNftsByAddressRequest = strictObject({
  addresses: pipe(array(
    strictObject({
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

const TokenType = union([
  literal('ERC721'),
  literal('ERC1155'),
  literal('NO_SUPPORTED_NFT_STANDARD'),
  literal('NOT_A_CONTRACT')
]);

const SpamClassification = union([
  literal('EmptyMetadata'),
  literal('SpammyMetadata'),
  literal('SuspiciousMetadata'),
])

// NFT Contract schema
const NftContract = strictObject({
  address: nullable(Address),
  name: nullable(string()),
  symbol: nullable(string()),
  totalSupply: nullable(string()),
  tokenType: nullable(TokenType),
  contractDeployer: nullable(Address),
  // TODO: why is this marked as double in docs?
  deployedBlockNumber: nullable(Integer),
  openseaMetadata: nullable(strictObject({
    floorPrice: nullable(Integer),
    collectionName: nullable(string()),
    // TODO: this field is missing in docs
    collectionSlug: nullable(string()),
    safelistRequestStatus: nullable(string()),
    imageUrl: nullable(string()),
    description: nullable(string()),
    externalUrl: nullable(string()),
    twitterUsername: nullable(string()),
    discordUrl: nullable(string()),
    bannerImageUrl: nullable(string()),
    lastIngestedAt: nullable(pipe(string(), isoTimestamp("YYYY-MM-DD'T'HH:mm:ss"))),
  })),
  isSpam: boolean(),
  spamClassifications: array(SpamClassification),
});

const NftImage = strictObject({
  cachedUrl: nullable(string()),
  thumbnailUrl: nullable(string()),
  pngUrl: nullable(string()),
  contentType: nullable(string()),
  size: nullable(Integer),
  originalUrl: nullable(string()),
});

// TODO: this field is missing in docs
const NftAnimation = strictObject({
  cachedUrl: nullable(string()),
  contentType: nullable(string()),
  size: nullable(Integer),
  originalUrl: nullable(string()),
});

const NftRawMetadata = strictObject({
  tokenUri: nullable(string()),
  metadata: nullable(strictObject({
    image: nullable(string()),
    name: nullable(string()),
    description: nullable(string()),
    attributes: nullable(array(strictObject({
      value: nullable(string()),
      trait_type: nullable(string()),
    }))),
  })),
  error: nullable(string()),
});

const NftCollection = strictObject({
  name: nullable(string()),
  slug: nullable(string()),
  externalUrl: nullable(string()),
  bannerImageUrl: nullable(string()),
});

const NftMint = strictObject({
  mintAddress: nullable(Address),
  blockNumber: nullable(Integer),
  timestamp: nullable(pipe(string(), isoTimestamp("YYYY-MM-DD'T'HH:mm:ss.SSSZ"))),
  transactionHash: nullable(Hex),
});

const NftAcquiredAt = strictObject({
  blockTimestamp: nullable(string()),
  blockNumber: nullable(string()),
});

const NftWithoutMetadata = strictObject({
  network: Network,

  address: Address,

  contractAddress: Address,

  tokenId: string(),

  // TODO: balance field is missing in docs..
  balance: string(),

  // TODO: these spam fields are not in docs though they are returned..
  isSpam: boolean(),

  // TODO: do we have a list of all spam classifications & brief explanation in docs?
  spamClassifications: array(SpamClassification),
});

const NftWithMetadata = strictObject({
  // TODO: why is this field nullable in docs?
  network: nullable(Network),

  // TODO: why is this field nullable in docs?
  address: nullable(Address),

  // TODO: incorrect default value in docs
  tokenId: nullable(string()),

  // TODO: balance field is missing in docs..
  balance: string(),

  contract: nullable(NftContract),

  // TODO: do we have a list of valid token types?
  tokenType: nullable(TokenType),

  name: nullable(string()),

  description: nullable(string()),

  tokenUri: nullable(string()),

  // TODO: why is this field nullable in docs?
  image: NftImage,

  // TODO: this field is missing in docs
  animation: NftAnimation,

  // TODO: why is this field nullable in docs?
  raw: NftRawMetadata,

  // TODO: why is this field nullable in docs?
  collection: NftCollection,

  mint: NftMint,

  // TODO: why is this field nullable in docs?
  timeLastUpdated: pipe(string(), isoTimestamp("YYYY-MM-DD'T'HH:mm:ss.SSSZ")),

  // TODO: why is this field nullable in docs?
  acquiredAt: NftAcquiredAt,
});

// Owned NFT schema
type OwnedNft = InferOutput<typeof OwnedNft>;
const OwnedNft = union([NftWithoutMetadata, NftWithMetadata]);

// Response schema for get-nfts-by-address
const GetNftsByAddressResponse = strictObject({
  data: strictObject({
    ownedNfts: nullable(array(OwnedNft)),
    totalCount: nullable(Integer),
    pageKey: nullable(string()),
  }),
});

export {
  OwnedNft,
  GetNftsByAddressRequest,
  GetNftsByAddressResponse,
};

