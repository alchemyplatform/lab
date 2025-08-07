import { FullMath } from './fullMath'

const Q96 = 2n ** 96n;
// https://github.com/Uniswap/sdks/blob/30b98e09d0486cd5cc3e4360e3277eb7cb60d2d5/sdks/v3-sdk/src/utils/sqrtPriceMath.ts#L25
export abstract class SqrtPriceMath {
  public static getAmount0Delta(
    sqrtRatioAX96: bigint,
    sqrtRatioBX96: bigint,
    liquidity: bigint,
    roundUp: boolean,
  ): bigint {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      const temp = sqrtRatioAX96
      sqrtRatioAX96 = sqrtRatioBX96
      sqrtRatioBX96 = temp
    }

    // const numerator1 = liquidity.leftShift(96)
    const numerator1 = liquidity * 2n ** 96n
    const numerator2 = sqrtRatioBX96 - (sqrtRatioAX96)

    return roundUp
      ? FullMath.mulDivRoundingUp(
        FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96),
        1n,
        sqrtRatioAX96,
      )
      : (numerator1 * numerator2) / sqrtRatioBX96 / sqrtRatioAX96
  }

  public static getAmount1Delta(
    sqrtRatioAX96: bigint,
    sqrtRatioBX96: bigint,
    liquidity: bigint,
    roundUp: boolean,
  ): bigint {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      const temp = sqrtRatioAX96
      sqrtRatioAX96 = sqrtRatioBX96
      sqrtRatioBX96 = temp
    }

    const difference = sqrtRatioBX96 - sqrtRatioAX96;

    return roundUp ? FullMath.mulDivRoundingUp(liquidity, difference, Q96) : (liquidity * difference) / Q96
  }
}