import { Context, Event } from "ponder:registry";
import { getConfig } from "../../utils/chains";
import { bundles, poolDayDatas, poolHourDatas, poolManagers, pools, swaps, tokenDayDatas, tokenHourDatas, tokens, uniswapDayDatas } from "ponder:schema";
import { convertTokenToDecimal, loadTransaction } from "../../utils";
import { ONE_BI, ZERO_BD } from "../../utils/constants";
import { getTrackedAmountUSD, sqrtPriceX96ToTokenPrices } from "../../utils/pricing";
import Decimal from "decimal.js";
import { updatePoolDayData, updatePoolHourData, updateTokenDayData, updateTokenHourData, updateUniswapDayData } from "../../utils/intervalUpdates";
import { findNativePerToken } from "../../utils/pricing/findNativePerToken";
import { eq } from "ponder";
import { getNativePriceInUSD } from "../../utils/pricing/getNativePriceInUsd";

export async function handleSwap({ event, context }: {
  event: Event<"PoolManager:Swap">,
  context: Context
}) {
  const config = getConfig(context.chain.name);

  const poolManagerAddress = config.poolManagerAddress
  const stablecoinWrappedNativePoolId = config.stablecoinWrappedNativePoolId
  const stablecoinIsToken0 = config.stablecoinIsToken0
  const wrappedNativeAddress = config.wrappedNativeAddress
  const stablecoinAddresses = config.stablecoinAddresses
  const minimumNativeLocked = config.minimumNativeLocked
  const whitelistTokens = config.whitelistTokens
  const nativeTokenDetails = config.nativeTokenDetails

  const bundle = await context.db.find(bundles, { id: '1' });
  if (!bundle) {
    console.warn('Bundle not found: {}', ['1'])
    return;
  }

  const poolManager = await context.db.find(poolManagers, { id: poolManagerAddress });
  if (!poolManager) {
    console.warn('Pool manager not found: {}', [poolManagerAddress])
    return;
  }

  const poolId = event.args.id;

  const pool = await context.db.find(pools, { id: poolId });
  if (!pool) {
    console.warn('Pool not found: {}', [poolId])
    return;
  }

  const token0 = await context.db.sql.query.tokens.findFirst({ where: eq(tokens.id, pool.token0), with: { whitelistPools: true } });
  const token1 = await context.db.sql.query.tokens.findFirst({ where: eq(tokens.id, pool.token1), with: { whitelistPools: true } });

  if (token0 && token1) {
    // amounts - 0/1 are token deltas: can be positive or negative
    // Unlike V3, a negative amount represents that amount is being sent to the pool and vice versa, so invert the sign

    const amount0 = convertTokenToDecimal(event.args.amount0, token0.decimals).times(-1)

    const amount1 = convertTokenToDecimal(event.args.amount1, token1.decimals).times(-1)

    // Update the pool feeTier with the fee from the swap event
    // This is important for dynamic fee pools where we want to keep store the actual last fee rather storing the dynamic flag (8388608)
    pool.feeTier = BigInt(event.args.fee);

    // need absolute amounts for volume
    let amount0Abs = amount0
    if (amount0.lt(ZERO_BD)) {
      amount0Abs = amount0.times(-1)
    }

    let amount1Abs = amount1
    if (amount1.lt(ZERO_BD)) {
      amount1Abs = amount1.times(-1)
    }

    const amount0ETH = amount0Abs.times(token0.derivedETH)
    const amount1ETH = amount1Abs.times(token1.derivedETH)
    const amount0USD = amount0ETH.times(bundle.ethPriceUSD)
    const amount1USD = amount1ETH.times(bundle.ethPriceUSD)

    // get amount that should be tracked only - div 2 because can't count both input and output as volume
    const amountTotalUSDTracked = (await getTrackedAmountUSD(context, amount0Abs, token0, amount1Abs, token1, whitelistTokens)).div(2);

    const amountTotalETHTracked = amountTotalUSDTracked.div(bundle.ethPriceUSD);
    const amountTotalUSDUntracked = amount0USD.plus(amount1USD).div(2);

    const feesETH = amountTotalETHTracked.times(pool.feeTier).div(1_000_000)
    const feesUSD = amountTotalUSDTracked.times(pool.feeTier).div(1_000_000)

    // global updates
    poolManager.txCount = poolManager.txCount + 1n
    poolManager.totalVolumeETH = new Decimal(poolManager.totalVolumeETH).plus(amountTotalETHTracked).toNumber()
    poolManager.totalVolumeUSD = new Decimal(poolManager.totalVolumeUSD).plus(amountTotalUSDTracked).toNumber()
    poolManager.untrackedVolumeUSD = new Decimal(poolManager.untrackedVolumeUSD).plus(amountTotalUSDUntracked).toNumber()
    poolManager.totalFeesETH = new Decimal(poolManager.totalFeesETH).plus(feesETH).toNumber()
    poolManager.totalFeesUSD = new Decimal(poolManager.totalFeesUSD).plus(feesUSD).toNumber()

    // reset aggregate tvl before individual pool tvl updates
    const currentPoolTvlETH = pool.totalValueLockedETH
    poolManager.totalValueLockedETH = new Decimal(poolManager.totalValueLockedETH).minus(currentPoolTvlETH).toNumber()

    // pool volume
    pool.volumeToken0 = new Decimal(pool.volumeToken0).plus(amount0Abs).toNumber()
    pool.volumeToken1 = new Decimal(pool.volumeToken1).plus(amount1Abs).toNumber()
    pool.volumeUSD = new Decimal(pool.volumeUSD).plus(amountTotalUSDTracked).toNumber()
    pool.untrackedVolumeUSD = new Decimal(pool.untrackedVolumeUSD).plus(amountTotalUSDUntracked).toNumber()
    pool.feesUSD = new Decimal(pool.feesUSD).plus(feesUSD).toNumber()
    pool.txCount = pool.txCount + 1n

    // Update the pool with the new active liquidity, price, and tick.
    pool.liquidity = event.args.liquidity
    pool.tick = BigInt(event.args.tick)
    pool.sqrtPrice = event.args.sqrtPriceX96
    pool.totalValueLockedToken0 = new Decimal(pool.totalValueLockedToken0).plus(amount0).toNumber()
    pool.totalValueLockedToken1 = new Decimal(pool.totalValueLockedToken1).plus(amount1).toNumber()

    // update token0 data
    token0.volume = new Decimal(token0.volume).plus(amount0Abs).toNumber()
    token0.totalValueLocked = new Decimal(token0.totalValueLocked).plus(amount0).toNumber()
    token0.volumeUSD = new Decimal(token0.volumeUSD).plus(amountTotalUSDTracked).toNumber()
    token0.untrackedVolumeUSD = new Decimal(token0.untrackedVolumeUSD).plus(amountTotalUSDUntracked).toNumber()
    token0.feesUSD = new Decimal(token0.feesUSD).plus(feesUSD).toNumber()
    token0.txCount = token0.txCount + 1n

    // update token1 data
    token1.volume = new Decimal(token1.volume).plus(amount1Abs).toNumber()
    token1.totalValueLocked = new Decimal(token1.totalValueLocked).plus(amount1).toNumber()
    token1.volumeUSD = new Decimal(token1.volumeUSD).plus(amountTotalUSDTracked).toNumber()
    token1.untrackedVolumeUSD = new Decimal(token1.untrackedVolumeUSD).plus(amountTotalUSDUntracked).toNumber()
    token1.feesUSD = new Decimal(token1.feesUSD).plus(feesUSD).toNumber()
    token1.txCount = token1.txCount + 1n

    // updated pool rates
    const prices = sqrtPriceX96ToTokenPrices(pool.sqrtPrice, token0, token1, nativeTokenDetails)
    pool.token0Price = prices[0].toNumber()
    pool.token1Price = prices[1].toNumber()

    // update USD pricing
    bundle.ethPriceUSD = (await getNativePriceInUSD(context, stablecoinWrappedNativePoolId, stablecoinIsToken0)).toNumber()
    await context.db.update(bundles, bundle);

    token0.derivedETH = (await findNativePerToken(context, token0, wrappedNativeAddress, stablecoinAddresses, new Decimal(minimumNativeLocked))).toNumber()
    token1.derivedETH = (await findNativePerToken(context, token1, wrappedNativeAddress, stablecoinAddresses, new Decimal(minimumNativeLocked))).toNumber()

    /**
     * Things afffected by new USD rates
     */
    pool.totalValueLockedETH = new Decimal(pool.totalValueLockedToken0)
      .times(token0.derivedETH)
      .plus(new Decimal(pool.totalValueLockedToken1).times(token1.derivedETH))
      .toNumber()
    pool.totalValueLockedUSD = new Decimal(pool.totalValueLockedETH).times(bundle.ethPriceUSD).toNumber()

    poolManager.totalValueLockedETH = new Decimal(poolManager.totalValueLockedETH).plus(pool.totalValueLockedETH).toNumber()
    poolManager.totalValueLockedUSD = new Decimal(poolManager.totalValueLockedETH).times(bundle.ethPriceUSD).toNumber()

    token0.totalValueLockedUSD = new Decimal(token0.totalValueLocked).times(token0.derivedETH).times(bundle.ethPriceUSD).toNumber()
    token1.totalValueLockedUSD = new Decimal(token1.totalValueLocked).times(token1.derivedETH).times(bundle.ethPriceUSD).toNumber()

    // create Swap
    const transaction = await loadTransaction(context, event);

    const hash = transaction.id;
    const logIndex = event.log.logIndex;

    await context.db.insert(swaps).values({
      hash,
      logIndex,
      sender: event.args.sender,
      recipient: '',
      origin: event.transaction.from,
      amount0: amount0.toNumber(),
      amount1: amount1.toNumber(),
      amountUSD: amountTotalUSDTracked.toNumber(),
      sqrtPriceX96: event.args.sqrtPriceX96,
      tick: BigInt(event.args.tick),
      timestamp: transaction.timestamp,

      transaction: hash,
      pool: pool.id,
      token0: token0.id,
      token1: token1.id
    });

    // interval data
    const uniswapDayData = await updateUniswapDayData(context, event, poolManagerAddress)
    const poolDayData = await updatePoolDayData(context, event, event.args.id)
    const poolHourData = await updatePoolHourData(context, event, event.args.id)
    const token0DayData = await updateTokenDayData(context, event, token0.id)
    const token1DayData = await updateTokenDayData(context, event, token1.id)
    const token0HourData = await updateTokenHourData(context, event, token0.id)
    const token1HourData = await updateTokenHourData(context, event, token1.id)

    // update volume metrics
    uniswapDayData.volumeETH = new Decimal(uniswapDayData.volumeETH).plus(amountTotalETHTracked).toNumber()
    uniswapDayData.volumeUSD = new Decimal(uniswapDayData.volumeUSD).plus(amountTotalUSDTracked).toNumber()
    uniswapDayData.feesUSD = new Decimal(uniswapDayData.feesUSD).plus(feesUSD).toNumber()

    poolDayData.volumeUSD = new Decimal(poolDayData.volumeUSD).plus(amountTotalUSDTracked).toNumber()
    poolDayData.volumeToken0 = new Decimal(poolDayData.volumeToken0).plus(amount0Abs).toNumber()
    poolDayData.volumeToken1 = new Decimal(poolDayData.volumeToken1).plus(amount1Abs).toNumber()
    poolDayData.feesUSD = new Decimal(poolDayData.feesUSD).plus(feesUSD).toNumber()

    poolHourData.volumeUSD = new Decimal(poolHourData.volumeUSD).plus(amountTotalUSDTracked).toNumber()
    poolHourData.volumeToken0 = new Decimal(poolHourData.volumeToken0).plus(amount0Abs).toNumber()
    poolHourData.volumeToken1 = new Decimal(poolHourData.volumeToken1).plus(amount1Abs).toNumber()
    poolHourData.feesUSD = new Decimal(poolHourData.feesUSD).plus(feesUSD).toNumber()

    token0DayData.volume = new Decimal(token0DayData.volume).plus(amount0Abs).toNumber()
    token0DayData.volumeUSD = new Decimal(token0DayData.volumeUSD).plus(amountTotalUSDTracked).toNumber()
    token0DayData.untrackedVolumeUSD = new Decimal(token0DayData.untrackedVolumeUSD).plus(amountTotalUSDTracked).toNumber()
    token0DayData.feesUSD = new Decimal(token0DayData.feesUSD).plus(feesUSD).toNumber()

    token0HourData.volume = new Decimal(token0HourData.volume).plus(amount0Abs).toNumber()
    token0HourData.volumeUSD = new Decimal(token0HourData.volumeUSD).plus(amountTotalUSDTracked).toNumber()
    token0HourData.untrackedVolumeUSD = new Decimal(token0HourData.untrackedVolumeUSD).plus(amountTotalUSDTracked).toNumber()
    token0HourData.feesUSD = new Decimal(token0HourData.feesUSD).plus(feesUSD).toNumber()

    token1DayData.volume = new Decimal(token1DayData.volume).plus(amount1Abs).toNumber()
    token1DayData.volumeUSD = new Decimal(token1DayData.volumeUSD).plus(amountTotalUSDTracked).toNumber()
    token1DayData.untrackedVolumeUSD = new Decimal(token1DayData.untrackedVolumeUSD).plus(amountTotalUSDTracked).toNumber()
    token1DayData.feesUSD = new Decimal(token1DayData.feesUSD).plus(feesUSD).toNumber()

    token1HourData.volume = new Decimal(token1HourData.volume).plus(amount1Abs).toNumber()
    token1HourData.volumeUSD = new Decimal(token1HourData.volumeUSD).plus(amountTotalUSDTracked).toNumber()
    token1HourData.untrackedVolumeUSD = new Decimal(token1HourData.untrackedVolumeUSD).plus(amountTotalUSDTracked).toNumber()
    token1HourData.feesUSD = new Decimal(token1HourData.feesUSD).plus(feesUSD).toNumber()


    await context.db.update(tokenDayDatas, { id: token0DayData.id }).set(token0DayData);
    await context.db.update(tokenDayDatas, { id: token1DayData.id }).set(token1DayData);
    await context.db.update(uniswapDayDatas, { id: uniswapDayData.id }).set(uniswapDayData);
    await context.db.update(poolDayDatas, { id: poolDayData.id }).set(poolDayData);
    await context.db.update(poolHourDatas, { id: poolHourData.id }).set(poolHourData);
    await context.db.update(tokenHourDatas, { id: token0HourData.id }).set(token0HourData);
    await context.db.update(tokenHourDatas, { id: token1HourData.id }).set(token1HourData);


    await context.db.update(poolManagers, { id: poolManagerAddress }).set(poolManager);
    await context.db.update(pools, { id: poolId }).set(pool);
    await context.db.update(tokens, { id: token0.id }).set(token0);
    await context.db.update(tokens, { id: token1.id }).set(token1);
  }

}