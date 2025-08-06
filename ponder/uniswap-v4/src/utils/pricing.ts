import Decimal from "decimal.js"
import { NativeTokenDetails } from "./nativeTokenDetails"
import { zeroAddress } from "viem"
import { exponentToBigDecimal } from ".";
import { tokens } from "ponder:schema";

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