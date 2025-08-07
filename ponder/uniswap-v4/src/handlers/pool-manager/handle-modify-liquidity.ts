import { Context, Event } from "ponder:registry";
import { createTick } from "../../utils/tick";
import { bundles, modifyLiquidities, poolManagers, pools, ticks, tokens } from "ponder:schema";
import { getAmount0, getAmount1 } from "../../utils/liquidityMath/liquidityAmounts";
import { getConfig } from "../../utils/chains";
import { convertTokenToDecimal, loadTransaction } from "../../utils";
import Decimal from "decimal.js";
import { updatePoolDayData, updatePoolHourData, updateTokenDayData, updateTokenHourData, updateUniswapDayData } from "../../utils/intervalUpdates";
import { calculateAmountUSD } from "../../utils/pricing";

export async function handleModifyLiquidity({ event, context }: { event: Event<"PoolManager:ModifyLiquidity">, context: Context }) {
  console.log(event.args);

  const config = getConfig(context.chain.name);
  const poolManagerAddress = config.poolManagerAddress;

  const bundle = await context.db.find(bundles, { id: '1' });
  if (bundle === null) {
    console.debug('handleModifyLiquidityHelper: bundle not found {}', ['1'])
    return;
  }

  const poolId = event.args.id;
  const pool = await context.db.find(pools, { id: poolId });
  if (pool === null) {
    console.debug('handleModifyLiquidityHelper: pool not found {}', [poolId])
    return;
  }

  const poolManager = await context.db.find(poolManagers, { id: poolManagerAddress });
  if (poolManager === null) {
    console.debug('handleModifyLiquidityHelper: pool manager not found {}', [poolManagerAddress])
    return;
  }

  const token0 = await context.db.find(tokens, { id: pool.token0 });
  const token1 = await context.db.find(tokens, { id: pool.token1 });

  if (token0 && token1) {
    const currTick = pool.tick
    const currSqrtPriceX96 = pool.sqrtPrice

    // Get the amounts using the getAmounts function
    const amount0Raw = getAmount0(
      event.args.tickLower,
      event.args.tickUpper,
      currTick,
      event.args.liquidityDelta,
      currSqrtPriceX96,
    )
    const amount1Raw = getAmount1(
      event.args.tickLower,
      event.args.tickUpper,
      currTick,
      event.args.liquidityDelta,
      currSqrtPriceX96,
    )
    const amount0 = convertTokenToDecimal(amount0Raw, token0.decimals)
    const amount1 = convertTokenToDecimal(amount1Raw, token1.decimals)

    const amountUSD = calculateAmountUSD(
      amount0,
      amount1,
      new Decimal(token0.derivedETH),
      new Decimal(token1.derivedETH),
      new Decimal(bundle.ethPriceUSD)
    );

    // reset tvl aggregates until new amounts calculated
    poolManager.totalValueLockedETH = Decimal(poolManager.totalValueLockedETH).minus(pool.totalValueLockedETH).toNumber();

    // update globals
    poolManager.txCount = poolManager.txCount + 1n;

    // update token0 data
    token0.txCount = token0.txCount + 1n;
    token0.totalValueLocked = Decimal(token0.totalValueLocked).plus(amount0).toNumber();
    token0.totalValueLockedUSD = Decimal(token0.totalValueLocked).times(Decimal(token0.derivedETH).times(bundle.ethPriceUSD)).toNumber();

    // update token1 data
    token1.txCount = token1.txCount + 1n;
    token1.totalValueLocked = Decimal(token1.totalValueLocked).plus(amount1).toNumber();
    token1.totalValueLockedUSD = Decimal(token1.totalValueLocked).times(Decimal(token1.derivedETH).times(bundle.ethPriceUSD)).toNumber();

    // pool data
    pool.txCount = pool.txCount + 1n;

    // Pools liquidity tracks the currently active liquidity given pools current tick.
    // We only want to update it if the new position includes the current tick.
    if (
      pool.tick !== null &&
      BigInt(event.args.tickLower) <= pool.tick &&
      BigInt(event.args.tickUpper) > pool.tick
    ) {
      pool.liquidity = pool.liquidity + event.args.liquidityDelta;
    }

    pool.totalValueLockedToken0 = Decimal(pool.totalValueLockedToken0).plus(amount0).toNumber();
    pool.totalValueLockedToken1 = Decimal(pool.totalValueLockedToken1).plus(amount1).toNumber();
    pool.totalValueLockedETH = Decimal(pool.totalValueLockedToken0)
      .times(token0.derivedETH)
      .plus(Decimal(pool.totalValueLockedToken1).times(token1.derivedETH))
      .toNumber();
    pool.totalValueLockedUSD = Decimal(pool.totalValueLockedETH)
      .times(bundle.ethPriceUSD)
      .toNumber();

    // reset aggregates with new amounts
    poolManager.totalValueLockedETH = Decimal(poolManager.totalValueLockedETH).plus(pool.totalValueLockedETH).toNumber();
    poolManager.totalValueLockedUSD = Decimal(poolManager.totalValueLockedETH).times(bundle.ethPriceUSD).toNumber();

    const transaction = await loadTransaction(context, event);

    const logIndex = event.log.logIndex;
    const modifyLiquidity = await context.db.insert(modifyLiquidities).values({
      // TODO:use composite key
      id: transaction.id + '-' + logIndex,
      transaction: transaction.id,
      timestamp: transaction.timestamp,
      pool: pool.id,
      token0: pool.token0,
      token1: pool.token1,
      sender: event.args.sender,
      origin: event.transaction.from,
      amount: event.args.liquidityDelta,
      amount0: amount0.toNumber(),
      amount1: amount1.toNumber(),
      amountUSD: amountUSD.toNumber(),
      tickLower: BigInt(event.args.tickLower),
      tickUpper: BigInt(event.args.tickUpper),
      logIndex: BigInt(logIndex),
    });

    // tick entities
    const lowerTickIdx = BigInt(event.args.tickLower)
    const upperTickIdx = BigInt(event.args.tickUpper)

    const lowerTickId = poolId + '#' + lowerTickIdx;
    const upperTickId = poolId + '#' + upperTickIdx;

    let lowerTick = await context.db.find(ticks, { id: lowerTickId })
    let upperTick = await context.db.find(ticks, { id: upperTickId })

    if (lowerTick === null) {
      lowerTick = await createTick(context, lowerTickId, lowerTickIdx, pool.id, event)
    }

    if (upperTick === null) {
      upperTick = await createTick(context, upperTickId, upperTickIdx, pool.id, event)
    }

    const amount = event.args.liquidityDelta

    await context.db.update(ticks, { id: lowerTickId }).set({
      liquidityGross: lowerTick.liquidityGross + amount,
      liquidityNet: lowerTick.liquidityNet + amount,
    });

    await context.db.update(ticks, { id: upperTickId }).set({
      liquidityGross: upperTick.liquidityGross + amount,
      liquidityNet: upperTick.liquidityNet - amount,
    });

    // TODO: could we simplify this by only storing hourly data and then aggregating the daily data?
    await updateUniswapDayData(context, event, poolManagerAddress);
    await updatePoolDayData(context, event, poolId);
    await updatePoolHourData(context, event, poolId);
    await updateTokenDayData(context, event, token0.id);
    await updateTokenDayData(context, event, token1.id);
    await updateTokenHourData(context, event, token0.id);
    await updateTokenHourData(context, event, token1.id);

    await context.db.update(tokens, { id: token0.id }).set(token0);
    await context.db.update(tokens, { id: token1.id }).set(token1);
    await context.db.update(pools, { id: pool.id }).set(pool);
    await context.db.update(poolManagers, { id: poolManagerAddress }).set(poolManager);
    await context.db.update(modifyLiquidities, { id: modifyLiquidity.id }).set(modifyLiquidity);
  }
}