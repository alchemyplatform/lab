async function getTokenBalancesByAddress({ address, networks }: { address: string, networks: string[] }) {
  const key = process.env.ALCHEMY_API_KEY;
  const url = `https://api.g.alchemy.com/data/v1/${key}/assets/tokens/balances/by-address`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      addresses: [
        {
          address,
          networks,
        }
      ]
    }),
  });
  const data = await response.json();
  return data;
}

export { getTokenBalancesByAddress };