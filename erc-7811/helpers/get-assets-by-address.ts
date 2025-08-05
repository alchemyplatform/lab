import { getNftsByAddress } from "./get-nfts-by-address";
import { getTokenBalancesByAddress } from "./get-token-balances-by-address";

async function getAssetsByAddress({ address, networks }: { address: string, networks: string[] }) {
  const tokens = await getTokenBalancesByAddress({ address, networks });
  const nfts = await getNftsByAddress({ address, networks });
  return [...tokens, ...nfts];
}

export { getAssetsByAddress };