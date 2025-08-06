import type { Asset, Erc20Asset, Erc721Asset, GenericAsset, NativeAsset } from "../schemas/erc-7811";
import type { NftWithMetadata, OwnedNft } from "../schemas/portfolio/get-nfts-by-address";
import type { Token } from "../schemas/portfolio/get-tokens-by-address";

function convertToNative(token: Token): NativeAsset {
  if (token.tokenAddress !== '0x0000000000000000000000000000000000000000') {
    throw new Error('Token is not a native token.');
  }

  return {
    address: 'native',
    balance: token.tokenBalance,
    type: "native",
  };
}

function convertToErc20(token: Token): Erc20Asset {
  if (token.tokenAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error('Token is not an ERC20.');
  }

  const metadata = token.tokenMetadata;
  if (!metadata?.name || !metadata?.symbol || !metadata?.decimals) {
    throw new Error('Missing required metadata to convert to Erc20Asset.');
  }
  return {
    address: token.address,
    balance: token.tokenBalance,
    type: "erc20",
    metadata: {
      name: metadata.name,
      symbol: metadata.symbol,
      decimals: metadata.decimals,
    }
  };
}

function convertToErc721(nft: NftWithMetadata): Erc721Asset {
  if (nft.tokenType !== 'ERC721') {
    throw new Error('NFT is not an ERC721.');
  }

  if (!nft.address || !nft.name || !nft.contract?.symbol || !nft.tokenId || !nft.tokenUri) {
    throw new Error('Missing required metadata to convert to Erc721Asset.');
  }

  return {
    address: nft.address,
    balance: '0x1',
    type: "erc721",
    metadata: {
      name: nft.name,
      symbol: nft.contract.symbol,
      tokenId: nft.tokenId,
      tokenURI: nft.tokenUri,
    },
  };
}

function convertToErc1155(nft: NftWithMetadata): GenericAsset {
  if (nft.tokenType !== 'ERC1155') {
    throw new Error('NFT is not an ERC1155.');
  }

  if (!nft.address || !nft.name || !nft.contract?.symbol || !nft.tokenId) {
    throw new Error('Missing required metadata to convert to Erc1155Asset.');
  }

  return {
    address: nft.address,
    balance: nft.balance,
    type: "erc1155",
    metadata: {
      name: nft.name,
      symbol: nft.contract.symbol,
      tokenId: nft.tokenId,
      tokenURI: nft.tokenUri,
    }
  }
}

export function convertAsset(asset: Token | OwnedNft): Asset {
  if ('tokenAddress' in asset) {
    if (asset.tokenAddress === '0x0000000000000000000000000000000000000000') {
      return convertToNative(asset);
    }
    return convertToErc20(asset);
  }

  if ('tokenType' in asset && asset.tokenType === 'ERC721') {
    return convertToErc721(asset);
  }

  if ('tokenType' in asset && asset.tokenType === 'ERC1155') {
    return convertToErc1155(asset);
  }

  throw new Error('Unknown asset type.');
}