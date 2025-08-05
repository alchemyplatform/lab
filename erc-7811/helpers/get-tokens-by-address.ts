import { parse } from "valibot";
import { GetTokensByAddressRequest, GetTokensByAddressResponse } from "../schemas/portfolio/get-token-by-address";

async function getTokensByAddress({ address, networks }: { address: string, networks: string[] }) {
  const request = parse(GetTokensByAddressRequest, {
    addresses: [address],
    networks: networks,
  });
  const key = process.env.ALCHEMY_API_KEY;
  const url = `https://api.g.alchemy.com/data/v1/${key}/assets/tokens/balances/by-address`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const json = await response.json();
  return parse(GetTokensByAddressResponse, json).data.tokens;
}

export { getTokensByAddress };