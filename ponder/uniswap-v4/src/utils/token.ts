import { zeroAddress } from "viem"
import { NativeTokenDetails } from "./nativeTokenDetails"
import { getStaticDefinition, StaticTokenDefinition } from "./staticTokenDefinition"
import { Context } from "ponder:registry";
import { ERC20Abi } from "../../abis/ERC20Abi";
import { ERC20SymbolBytesAbi } from "../../abis/ERC20SymbolBytesAbi";
import { ERC20NameBytesAbi } from "../../abis/ERC20NameBytesAbi";

const NULL_ETH_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001';

export async function fetchTokenSymbol(
  client: Context['client'],
  tokenAddress: string,
  tokenOverrides: StaticTokenDefinition[],
  nativeTokenDetails: NativeTokenDetails,
): Promise<string> {
  if (tokenAddress === zeroAddress) {
    return nativeTokenDetails.symbol;
  }

  // try with the static definition
  const staticTokenDefinition = getStaticDefinition(tokenAddress, tokenOverrides);
  if (staticTokenDefinition !== null) {
    return staticTokenDefinition.symbol;
  }

  let symbolValue = 'unknown';

  // try types string and bytes32 for symbol
  // TODO: should be a better way to do this with 1 ABI instead of 2
  // TODO: what happens if call reverts?
  try {
    const symbolResult = await client.readContract({
      abi: ERC20Abi,
      address: tokenAddress as `0x${string}`,
      // TODO: update Ponder docs to use functionName instead of method
      // see https://ponder.sh/docs/indexing/read-contracts#client
      functionName: "symbol",
    });

    symbolValue = symbolResult;
  } catch (error) {
    let symbolResultBytes: string | undefined;

    try {
      symbolResultBytes = await client.readContract({
        abi: ERC20SymbolBytesAbi,
        address: tokenAddress as `0x${string}`,
        functionName: "symbol",
      });

      // for broken pairs that have no symbol function exposed
      if (symbolResultBytes !== NULL_ETH_VALUE) {
        symbolValue = symbolResultBytes;
      }
    } catch (error) {
      // do nothing
    }
  }

  return symbolValue;
}

export async function fetchTokenName(
  client: Context['client'],
  tokenAddress: string,
  tokenOverrides: StaticTokenDefinition[],
  nativeTokenDetails: NativeTokenDetails,
): Promise<string> {
  if (tokenAddress === zeroAddress) {
    return nativeTokenDetails.name
  }
  // try with the static definition
  const staticTokenDefinition = getStaticDefinition(tokenAddress, tokenOverrides)
  if (staticTokenDefinition !== null) {
    return staticTokenDefinition.name
  }

  let nameValue = 'unknown';

  // try types string and bytes32 for name
  try {
    const nameResult = await client.readContract({
      abi: ERC20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "name",
    });

    nameValue = nameResult;
  } catch (error) {
    let nameResultBytes: string | undefined;

    try {
      nameResultBytes = await client.readContract({
        abi: ERC20NameBytesAbi,
        address: tokenAddress as `0x${string}`,
        functionName: "name",
      });

      // for broken exchanges that have no name function exposed
      if (nameResultBytes !== NULL_ETH_VALUE) {
        nameValue = nameResultBytes;
      }
    } catch (error) {
      // do nothing
    }
  }

  return nameValue
}

export async function fetchTokenTotalSupply(
  client: Context['client'],
  tokenAddress: string,
): Promise<bigint> {
  if (tokenAddress === zeroAddress) {
    return 0n;
  }

  let totalSupplyValue = 0n;

  try {
    const totalSupplyResult = await client.readContract({
      abi: ERC20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "totalSupply",
    });

    totalSupplyValue = totalSupplyResult;
  } catch (error) {
    // do nothing
  }

  return totalSupplyValue;
}

export async function fetchTokenDecimals(
  client: Context['client'],
  tokenAddress: string,
  tokenOverrides: StaticTokenDefinition[],
  nativeTokenDetails: NativeTokenDetails,
): Promise<bigint | null> {
  if (tokenAddress === zeroAddress) {
    return nativeTokenDetails.decimals
  }
  // try with the static definition
  const staticTokenDefinition = getStaticDefinition(tokenAddress, tokenOverrides)
  if (staticTokenDefinition) {
    return staticTokenDefinition.decimals
  }

  // try types uint8 for decimals
  const decimalsResult = await client.readContract({
    abi: ERC20Abi,
    address: tokenAddress as `0x${string}`,
    functionName: "decimals",
  });

  if (decimalsResult < 255) {
    return BigInt(decimalsResult);
  }

  return null;
}