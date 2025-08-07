import Decimal from "decimal.js"
import { ZERO_BD } from "../constants"
import { pools } from "ponder:schema";
import { Context } from "ponder:registry";

export async function getNativePriceInUSD(context: Context, stablecoinWrappedNativePoolId: string, stablecoinIsToken0: boolean): Promise<Decimal> {
  const stablecoinWrappedNativePool = await context.db.find(pools, { id: stablecoinWrappedNativePoolId });
  if (stablecoinWrappedNativePool !== null) {
    return stablecoinIsToken0 ? new Decimal(stablecoinWrappedNativePool.token0Price) : new Decimal(stablecoinWrappedNativePool.token1Price)
  } else {
    return ZERO_BD
  }
}