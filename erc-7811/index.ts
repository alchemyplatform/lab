import { parse } from "valibot";
import { WalletGetAssetsRequest, type Asset, type WalletGetAssetsResponse } from "./schemas/erc-7811";
import { getTokenBalancesByAddress } from "./helpers/get-token-balances-by-address";
import { getNftsByAddress } from "./helpers/get-nfts-by-address";
import { getAssetsByAddress } from "./helpers/get-assets-by-address";
import { convertAsset } from "./helpers/convert-to-erc-7811";
import { getTokensByAddress } from "./helpers/get-tokens-by-address";
import type { Token } from "./schemas/portfolio/get-tokens-by-address";
import type { NftWithMetadata } from "./schemas/portfolio/get-nfts-by-address";


const chainIdToNetwork = new Map<string, string>([
  ["0x1", "eth-mainnet"],
  ["0xaa36a7", "eth-sepolia"],
  ["0xa4b1", "arb-mainnet"],
  ["0x66eee", "arb-sepolia"],
  ["0xa86a", "avax-mainnet"],
  ["0xa869", "avax-fuji"],
  ["0x2105", "base-mainnet"],
  ["0x14a33", "base-sepolia"],
  ["0x38", "bnb-mainnet"],
  ["0x61", "bnb-testnet"],
  ["0xa", "opt-mainnet"],
  ["0x1a4", "opt-sepolia"],
  ["0x89", "polygon-mainnet"],
  ["0x13882", "polygon-amoy"],
  ["0x1389", "sonic-mainnet"],
  ["0x138a", "sonic-blaze"],
  ["0x144", "zksync-mainnet"],
  ["0x12c", "zksync-sepolia"],
]);

const networkToChainId = new Map<string, string>([
  ["eth-mainnet", "0x1"],
  ["eth-sepolia", "0xaa36a7"],
  ["arb-mainnet", "0xa4b1"],
  ["arb-sepolia", "0x66eee"],
  ["avax-mainnet", "0xa86a"],
  ["avax-fuji", "0xa869"],
  ["base-mainnet", "0x2105"],
  ["base-sepolia", "0x14a33"],
  ["bnb-mainnet", "0x38"],
  ["bnb-testnet", "0x61"],
  ["opt-mainnet", "0xa"],
  ["opt-sepolia", "0x1a4"],
  ["polygon-mainnet", "0x89"],
  ["polygon-amoy", "0x13882"],
  ["zksync-mainnet", "0x144"],
  ["zksync-sepolia", "0x12c"],
]);

function getAllSupportedNetworks(): string[] {
  return Array.from(chainIdToNetwork.values());
}

function getSupportedNetworks(chainFilter: string[]): string[] {
  const networks: string[] = [];
  for (const chainId of chainFilter) {
    const network = chainIdToNetwork.get(chainId);
    if (!network) {
      throw new Error(`Portfolio API does not support chainId: ${chainId}.`);
    }
    networks.push(network);
  }
  return networks;
}

async function getAssets(request: WalletGetAssetsRequest): Promise<WalletGetAssetsResponse> {
  const { account, assetFilter, assetTypeFilter, chainFilter } = parse(WalletGetAssetsRequest, request);

  if (assetFilter && (assetTypeFilter || chainFilter)) {
    throw new Error(`Cannot use assetFilter with assetTypeFilter or chainFilter.

If the assetFilter field is provided, the wallet MUST only return the assets specified within it, even if assetTypeFilter or chainFilter could have further filtered the result. 

This effectively disregards the assetTypeFilter and chainFilter fields entirely. The reason for this is that they are already implicitly defined within the assetFilter.

See https://eip.tools/eip/7811 for more details.`);
  }

  /*
    If the assetFilter field is provided, the wallet MUST only return the assets specified within it, even if assetTypeFilter or chainFilter could have further filtered the result. 

    This effectively disregards the assetTypeFilter and chainFilter fields entirely. The reason for this is that they are already implicitly defined within the assetFilter.
  */
  if (assetFilter) {
    for (const [chainId, assets] of Object.entries(assetFilter)) {
      console.log(chainId, assets);

      const network = chainIdToNetwork.get(chainId);
      if (!network) {
        throw new Error(`Portfolio API does not support chainId: ${chainId}.`);
      }
    }

    throw new Error('Not implemented');
  }

  /*
    chainFilter is an OPTIONAL field that specifies an array of chain ids, where each value in the array MUST be a valid EIP-155 chainId.
  */
  const networks = chainFilter ? getSupportedNetworks(chainFilter) : getAllSupportedNetworks();

  /*
    assetTypeFilter is an OPTIONAL field that specifies an array of asset types, as defined in this ERC. If assetTypeFilter field is provided, wallet MUST include only assets with those types in the response.
  */
  if (assetTypeFilter) {
    const assets: (Token | NftWithMetadata)[] = [];

    const includeNative = assetTypeFilter.includes('native');
    const includeErc20 = assetTypeFilter.includes('erc20');
    const includeErc721 = assetTypeFilter.includes('erc721');
    const includeErc1155 = assetTypeFilter.includes('erc1155');

    if (includeNative || includeErc20) {
      const tokens = await getTokensByAddress({ address: account, networks: networks, includeNative, includeErc20 }) ?? [];
      assets.push(...tokens);
    }

    if (includeErc721 || includeErc1155) {
      const nfts = await getNftsByAddress({ address: account, networks: networks }) ?? [];
      const onlyErc721 = includeErc721 && !includeErc1155;
      const onlyErc1155 = includeErc1155 && !includeErc721;
      const both = includeErc721 && includeErc1155;

      let filteredNfts: NftWithMetadata[] = [];
      if (onlyErc721) {
        filteredNfts = nfts.filter(nft => nft.tokenType === 'ERC721');
      } else if (onlyErc1155) {
        filteredNfts = nfts.filter(nft => nft.tokenType === 'ERC1155');
      } else if (both) {
        filteredNfts = nfts.filter(nft => nft.tokenType === 'ERC721' || nft.tokenType === 'ERC1155');
      }
      assets.push(...filteredNfts);
    }

    const assetsByNetwork = assets.reduce((acc, asset) => {
      const network = asset.network;
      if (!network) {
        throw new Error(`Asset ${asset.address} has no network.`);
      }
      const chainId = networkToChainId.get(network);
      if (!chainId) {
        throw new Error(`Portfolio API does not support network: ${network}.`);
      }
      if (!acc[chainId]) {
        acc[chainId] = [];
      }
      acc[chainId].push(convertAsset(asset));
      return acc;
    }, {} as Record<string, Asset[]>);

    return assetsByNetwork;
  }


  /*
    If the assetFilter field is omitted, the wallet SHOULD return all available assets for the requested account. It is RECOMMENDED that the returned assets be ordered by estimated value in descending order, as determined by the wallet.
  */
  const assets = await getAssetsByAddress({ address: account, networks: networks });

  const assetsByNetwork = assets.reduce((acc, asset) => {
    const network = asset.network;
    if (!network) {
      throw new Error(`Asset ${asset.address} has no network.`);
    }
    const chainId = networkToChainId.get(network);
    if (!chainId) {
      throw new Error(`Portfolio API does not support network: ${network}.`);
    }
    if (!acc[chainId]) {
      acc[chainId] = [];
    }
    acc[chainId].push(convertAsset(asset));
    return acc;
  }, {} as Record<string, Asset[]>);

  return assetsByNetwork;
}


// vitalik.eth
const account = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

const results = await getAssets({
  "account": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  // "assetFilter": {
  //   "0x1": [
  //     {
  //       "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  //       "type": "erc20"
  //     },
  //     {
  //       "address": "native",
  //       "type": "native"
  //     }
  //   ],
  //   "0xa": [
  //     {
  //       "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  //       "type": "erc20"
  //     }
  //   ]
  // },
  // "assetTypeFilter": ["erc20", "native"],
  // "chainFilter": ["0x1"]
});
console.log(`Results: ${JSON.stringify(results, null, 2)}`);
