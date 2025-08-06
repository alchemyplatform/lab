// Initialize a Token Definition with the attributes
export type StaticTokenDefinition = {
  address: string;
  symbol: string
  name: string
  decimals: bigint
}

export const getStaticDefinition = (
  tokenAddress: string,
  staticDefinitions: StaticTokenDefinition[],
): StaticTokenDefinition | null => {
  // Search the definition using the address
  for (let i = 0; i < staticDefinitions.length; i++) {
    const staticDefinition = staticDefinitions[i]
    if (staticDefinition?.address === tokenAddress) {
      return staticDefinition;
    }
  }

  // If not found, return null
  return null
}