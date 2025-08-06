import { parse } from "valibot";
import { GetTokensByAddressRequest, GetTokensByAddressResponse } from "../schemas/portfolio/get-tokens-by-address";

// TODO: add pagination
async function getTokensByAddress({ address, networks, includeNative, includeErc20 }: {
  address: string,
  networks: string[],
  includeNative?: boolean,
  includeErc20?: boolean,
}): Promise<GetTokensByAddressResponse['data']['tokens']> {
  const request = parse(GetTokensByAddressRequest, {
    addresses: [
      {
        address,
        networks,
      }
    ],
    includeNativeTokens: includeNative,
    includeErc20Tokens: includeErc20,
    withMetadata: true,
  });
  const key = process.env.ALCHEMY_API_KEY;
  const url = `https://api.g.alchemy.com/data/v1/${key}/assets/tokens/by-address`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const json = await response.json();
  return parse(GetTokensByAddressResponse, json).data.tokens;
}

export { getTokensByAddress };