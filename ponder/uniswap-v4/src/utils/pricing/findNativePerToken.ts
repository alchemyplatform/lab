import Decimal from "decimal.js"
import { zeroAddress } from "viem"
import { ONE_BD, ZERO_BD, ZERO_BI } from "../constants";
import { bundles, pools, tokens } from "ponder:schema";
import { Context } from "ponder:registry";

/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived ETH (add stablecoin estimates)
 **/
export async function findNativePerToken(
  context: Context,
  token: typeof tokens.$inferSelect & { whitelistPools: typeof pools.$inferSelect[] },
  wrappedNativeAddress: string,
  stablecoinAddresses: string[],
  minimumNativeLocked: Decimal,
): Promise<Decimal> {
  if (token.id == wrappedNativeAddress || token.id == zeroAddress) {
    return ONE_BD;
  }
  const whiteList = token.whitelistPools
  // for now just take USD from pool with greatest TVL
  // need to update this to actually detect best rate based on liquidity distribution
  let largestLiquidityETH = ZERO_BD
  let priceSoFar = ZERO_BD

  const bundle = await context.db.find(bundles, { id: '1' });
  if (bundle === null) {
    throw new Error('Bundle not found');
  }

  // hardcoded fix for incorrect rates
  // if whitelist includes token - get the safe price
  if (stablecoinAddresses.includes(token.id)) {
    priceSoFar = ONE_BD.div(bundle.ethPriceUSD)
  } else {
    for (let i = 0; i < whiteList.length; ++i) {
      const poolAddress = whiteList[i]
      const pool = await context.db.find(pools, { id: poolAddress });

      if (pool) {
        if (pool.liquidity > ZERO_BI) {
          if (pool.token0 == token.id) {
            // whitelist token is token1
            const token1 = await context.db.find(tokens, { id: pool.token1 });
            // get the derived ETH in pool
            if (token1) {
              const ethLocked = new Decimal(pool.totalValueLockedToken1).times(token1.derivedETH)
              if (ethLocked.gt(largestLiquidityETH) && ethLocked.gt(minimumNativeLocked)) {
                largestLiquidityETH = ethLocked
                // token1 per our token * Eth per token1 
                priceSoFar = new Decimal(pool.token1Price).times(token1.derivedETH)
              }
            }
          }
          if (pool.token1 == token.id) {
            const token0 = await context.db.find(tokens, { id: pool.token0 });
            // get the derived ETH in pool
            if (token0) {
              const ethLocked = new Decimal(pool.totalValueLockedToken0).times(token0.derivedETH)
              if (ethLocked.gt(largestLiquidityETH) && ethLocked.gt(minimumNativeLocked)) {
                largestLiquidityETH = ethLocked
                // token0 per our token * ETH per token0
                priceSoFar = new Decimal(pool.token0Price).times(token0.derivedETH)
              }
            }
          }
        }
      }
    }
  }
  return priceSoFar
}