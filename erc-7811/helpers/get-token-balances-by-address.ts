import { parse } from "valibot";
import { GetTokenBalancesByAddressRequest, GetTokenBalancesByAddressResponse } from "../schemas/portfolio/get-token-balances-by-address";

async function getTokenBalancesByAddress({ address, networks }: { address: string, networks: string[] }) {
  const request = parse(GetTokenBalancesByAddressRequest, {
    addresses: [{
      address,
      networks
    }],
  });
  const key = process.env.ALCHEMY_API_KEY;
  const url = `https://api.g.alchemy.com/data/v1/${key}/assets/tokens/balances/by-address`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const json = await response.json();
  return parse(GetTokenBalancesByAddressResponse, json).data.tokens;
}

export { getTokenBalancesByAddress };