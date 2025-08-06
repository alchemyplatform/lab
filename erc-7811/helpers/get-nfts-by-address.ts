import { parse } from "valibot";
import { GetNftsByAddressRequest, GetNftsByAddressResponse } from "../schemas/portfolio/get-nfts-by-address";

async function getNftsByAddress({ address, networks }: { address: string, networks: string[] }) {
  const request = parse(GetNftsByAddressRequest, {
    addresses: [{
      address,
      networks,
    }],
    withMetadata: true,
  });
  const key = process.env.ALCHEMY_API_KEY;
  const url = `https://api.g.alchemy.com/data/v1/${key}/assets/nfts/by-address`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const json = await response.json();
  return parse(GetNftsByAddressResponse, json).data.ownedNfts;
}

export { getNftsByAddress };