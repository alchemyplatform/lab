async function getNftsByAddress({ address, networks }: { address: string, networks: string[] }) {
  const key = process.env.ALCHEMY_API_KEY;
  const url = `https://api.g.alchemy.com/data/v1/${key}/assets/nfts/by-address`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      addresses: [
        {
          address,
          networks,
        }
      ],
      withMetadata: true,
    }),
  });
  const data = await response.json();
  return data;
}

export { getNftsByAddress };