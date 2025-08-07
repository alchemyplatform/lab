import Decimal from "decimal.js"
import { NativeTokenDetails } from "./nativeTokenDetails"
import { zeroAddress } from "viem"
import { exponentToBigDecimal } from ".";
import { bundles, tokens } from "ponder:schema";
import { ZERO_BD } from "./constants";
import { Context } from "ponder:registry";

const Q192 = 2n ** 192n;

export function sqrtPriceX96ToTokenPrices(
  sqrtPriceX96: bigint,
  // TODO: this is a hack to get types to work
  // ideally we'd import from ponder schema directly - figure out how to do this
  token0: { id: string, decimals: bigint },
  token1: { id: string, decimals: bigint },
  nativeTokenDetails: NativeTokenDetails,
): [Decimal, Decimal] {
  const token0Decimals = token0.id === zeroAddress ? nativeTokenDetails.decimals : token0.decimals
  const token1Decimals = token1.id == zeroAddress ? nativeTokenDetails.decimals : token1.decimals

  const num = new Decimal(sqrtPriceX96).times(sqrtPriceX96);
  const denom = new Decimal(Q192);
  const price1 = num.div(denom).times(exponentToBigDecimal(token0Decimals)).div(exponentToBigDecimal(token1Decimals))

  const price0 = new Decimal(1).div(price1);
  return [price0, price1];
}

export function calculateAmountUSD(
  amount0: Decimal,
  amount1: Decimal,
  token0DerivedETH: Decimal,
  token1DerivedETH: Decimal,
  ethPriceUSD: Decimal,
): Decimal {
  return amount0.times(token0DerivedETH.times(ethPriceUSD)).plus(amount1.times(token1DerivedETH.times(ethPriceUSD)));
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export async function getTrackedAmountUSD(
  context: Context,
  tokenAmount0: Decimal,
  token0: typeof tokens.$inferSelect,
  tokenAmount1: Decimal,
  token1: typeof tokens.$inferSelect,
  whitelistTokens: string[],
): Promise<Decimal> {
  const bundle = await context.db.find(bundles, { id: '1' });
  if (!bundle) {
    throw new Error('Bundle not found');
  }

  const price0USD = new Decimal(token0.derivedETH).times(bundle.ethPriceUSD)
  const price1USD = new Decimal(token1.derivedETH).times(bundle.ethPriceUSD)

  // both are whitelist tokens, return sum of both amounts
  if (whitelistTokens.includes(token0.id) && whitelistTokens.includes(token1.id)) {
    return tokenAmount0.times(price0USD).plus(tokenAmount1.times(price1USD))
  }

  // take double value of the whitelisted token amount
  if (whitelistTokens.includes(token0.id) && !whitelistTokens.includes(token1.id)) {
    return tokenAmount0.times(price0USD).times(2)
  }

  // take double value of the whitelisted token amount
  if (!whitelistTokens.includes(token0.id) && whitelistTokens.includes(token1.id)) {
    return tokenAmount1.times(price1USD).times(2)
  }

  // neither token is on white list, tracked amount is 0
  return ZERO_BD;
}