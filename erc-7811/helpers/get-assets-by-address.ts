import { getNftsByAddress } from "./get-nfts-by-address";
import { getTokensByAddress } from "./get-tokens-by-address";

// Get all assets for an address
async function getAssetsByAddress({ address, networks }: { address: string, networks: string[] }) {
  const tokens = await getTokensByAddress({ address, networks });
  const nfts = await getNftsByAddress({ address, networks });
  return [...tokens ?? [], ...nfts ?? []];
}

export { getAssetsByAddress };