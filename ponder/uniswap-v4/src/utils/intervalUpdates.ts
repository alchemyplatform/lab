import { Context, Event } from 'ponder:registry'
import { bundles, poolDayDatas, poolHourDatas, poolManagers, pools, tokenDayDatas, tokenHourDatas, tokens, uniswapDayDatas } from 'ponder:schema'
import Decimal from 'decimal.js';

/**
 * Tracks global aggregate data over daily windows
 * @param event
 */
export async function updateUniswapDayData(context: Context, event: Event, poolId: string) {
  const uniswap = await context.db.find(poolManagers, { id: poolId });

  if (uniswap === null) {
    throw new Error(`PoolManager ${poolId} not found`);
  }

  const timestamp = event.block.timestamp;
  const dayID = timestamp / 86400n; // rounded
  const dayStartTimestamp = dayID * 86400n;

  let uniswapDayData = await context.db.find(uniswapDayDatas, { id: dayID.toString() });

  if (uniswapDayData === null) {
    return await context.db.insert(uniswapDayDatas).values({
      id: dayID.toString(),
      date: dayStartTimestamp,
      volumeETH: 0,
      volumeUSD: 0,
      volumeUSDUntracked: 0,
      feesUSD: 0,
      tvlUSD: uniswap.totalValueLockedUSD,
      txCount: uniswap.txCount,
    });
  }

  return await context.db.update(uniswapDayDatas, { id: dayID.toString() }).set({
    tvlUSD: uniswap.totalValueLockedUSD,
    txCount: uniswap.txCount,
  });
}

export async function updatePoolDayData(context: Context, event: Event, poolId: string) {
  const timestamp = event.block.timestamp;
  const dayID = timestamp / 86400n;
  const dayStartTimestamp = dayID * 86400n;
  const dayPoolID = poolId.concat('-').concat(dayID.toString());

  const pool = await context.db.find(pools, { id: poolId });
  if (pool === null) {
    throw new Error(`Pool ${poolId} not found`);
  }

  let poolDayData = await context.db.find(poolDayDatas, { id: dayPoolID });
  if (poolDayData === null) {
    poolDayData = await context.db.insert(poolDayDatas).values({
      id: dayPoolID,
      date: dayStartTimestamp,
      pool: pool.id,
      volumeToken0: 0,
      volumeToken1: 0,
      volumeUSD: 0,
      feesUSD: 0,
      txCount: 0n,
      open: pool.token0Price,
      high: pool.token0Price,
      low: pool.token0Price,
      close: pool.token0Price,
      liquidity: pool.liquidity,
      sqrtPrice: pool.sqrtPrice,
      token0Price: pool.token0Price,
      token1Price: pool.token1Price,
      tick: pool.tick,
      tvlUSD: pool.totalValueLockedUSD,
    });
  }


  if (pool.token0Price > poolDayData.high) {
    poolDayData.high = pool.token0Price
  }
  if (pool.token0Price < poolDayData.low) {
    poolDayData.low = pool.token0Price
  }

  poolDayData.liquidity = pool.liquidity
  poolDayData.sqrtPrice = pool.sqrtPrice
  poolDayData.token0Price = pool.token0Price
  poolDayData.token1Price = pool.token1Price
  poolDayData.close = pool.token0Price
  poolDayData.tick = pool.tick
  poolDayData.tvlUSD = pool.totalValueLockedUSD
  poolDayData.txCount = poolDayData.txCount + 1n

  await context.db.update(poolDayDatas, { id: dayPoolID }).set(poolDayData);

  return poolDayData;
}

export async function updatePoolHourData(context: Context, event: Event, poolId: string) {
  const timestamp = event.block.timestamp
  const hourIndex = timestamp / 3600n // get unique hour within unix history
  const hourStartUnix = hourIndex * 3600n // want the rounded effect
  const hourPoolID = poolId.concat('-').concat(hourIndex.toString())
  const pool = await context.db.find(pools, { id: poolId });
  if (pool === null) {
    throw new Error(`Pool ${poolId} not found`);
  }

  let poolHourData = await context.db.find(poolHourDatas, { id: hourPoolID });
  if (poolHourData === null) {
    poolHourData = await context.db.insert(poolHourDatas).values({
      id: hourPoolID,
      periodStartUnix: hourStartUnix,
      pool: pool.id,
      volumeToken0: 0,
      volumeToken1: 0,
      volumeUSD: 0,
      feesUSD: 0,
      txCount: 0n,
      open: pool.token0Price,
      high: pool.token0Price,
      low: pool.token0Price,
      close: pool.token0Price,
      liquidity: pool.liquidity,
      sqrtPrice: pool.sqrtPrice,
      token0Price: pool.token0Price,
      token1Price: pool.token1Price,
      tick: pool.tick,
      tvlUSD: pool.totalValueLockedUSD,
    });
  }

  if (pool.token0Price > poolHourData.high) {
    poolHourData.high = pool.token0Price
  }
  if (pool.token0Price < poolHourData.low) {
    poolHourData.low = pool.token0Price
  }

  poolHourData.liquidity = pool.liquidity
  poolHourData.sqrtPrice = pool.sqrtPrice
  poolHourData.token0Price = pool.token0Price
  poolHourData.token1Price = pool.token1Price
  poolHourData.close = pool.token0Price
  poolHourData.tick = pool.tick
  poolHourData.tvlUSD = pool.totalValueLockedUSD
  poolHourData.txCount = poolHourData.txCount + 1n

  return await context.db.update(poolHourDatas, { id: hourPoolID }).set(poolHourData);
}

export async function updateTokenDayData(context: Context, event: Event, tokenId: string) {
  const bundle = await context.db.find(bundles, { id: '1' });
  if (bundle === null) {
    throw new Error(`Bundle not found`);
  }

  const timestamp = event.block.timestamp
  const dayID = timestamp / 86400n
  const dayStartTimestamp = dayID * 86400n
  const tokenDayID = tokenId.concat('-').concat(dayID.toString())
  const token = await context.db.find(tokens, { id: tokenId });
  if (token === null) {
    throw new Error(`Token ${tokenId} not found`);
  }
  const tokenPrice = Decimal(token.derivedETH).times(bundle.ethPriceUSD)

  let tokenDayData = await context.db.find(tokenDayDatas, { id: tokenDayID });
  if (tokenDayData === null) {
    tokenDayData = await context.db.insert(tokenDayDatas).values({
      id: tokenDayID,
      date: dayStartTimestamp,
      token: token.id,
      volume: 0,
      volumeUSD: 0,
      feesUSD: 0,
      untrackedVolumeUSD: 0,
      open: tokenPrice.toNumber(),
      high: tokenPrice.toNumber(),
      low: tokenPrice.toNumber(),
      close: tokenPrice.toNumber(),
      totalValueLocked: token.totalValueLocked,
      totalValueLockedUSD: token.totalValueLockedUSD,
      priceUSD: tokenPrice.toNumber(),
    });
  }

  if (tokenPrice.gt(tokenDayData.high)) {
    tokenDayData.high = tokenPrice.toNumber()
  }

  if (tokenPrice.lt(tokenDayData.low)) {
    tokenDayData.low = tokenPrice.toNumber()
  }

  tokenDayData.close = tokenPrice.toNumber()
  tokenDayData.priceUSD = tokenPrice.toNumber()
  tokenDayData.totalValueLocked = token.totalValueLocked
  tokenDayData.totalValueLockedUSD = token.totalValueLockedUSD

  return await context.db
    .update(tokenDayDatas, { id: tokenDayID })
    .set(tokenDayData);
}

export async function updateTokenHourData(context: Context, event: Event, tokenId: string) {
  const bundle = await context.db.find(bundles, { id: '1' });
  if (bundle === null) {
    throw new Error(`Bundle not found`);
  }

  const timestamp = event.block.timestamp
  const hourIndex = timestamp / 3600n // get unique hour within unix history
  const hourStartUnix = hourIndex * 3600n // want the rounded effect
  const tokenHourID = tokenId.concat('-').concat(hourIndex.toString())
  const token = await context.db.find(tokens, { id: tokenId });
  if (token === null) {
    throw new Error(`Token ${tokenId} not found`);
  }
  const tokenPrice = Decimal(token.derivedETH).times(bundle.ethPriceUSD)
  let tokenHourData = await context.db.find(tokenHourDatas, { id: tokenHourID });

  if (tokenHourData === null) {
    tokenHourData = await context.db.insert(tokenHourDatas).values({
      id: tokenHourID,
      periodStartUnix: hourStartUnix,
      token: token.id,
      volume: 0,
      volumeUSD: 0,
      untrackedVolumeUSD: 0,
      feesUSD: 0,
      open: tokenPrice.toNumber(),
      high: tokenPrice.toNumber(),
      low: tokenPrice.toNumber(),
      close: tokenPrice.toNumber(),
      totalValueLocked: token.totalValueLocked,
      totalValueLockedUSD: token.totalValueLockedUSD,
      priceUSD: tokenPrice.toNumber(),
    });
  }

  if (tokenPrice.gt(tokenHourData.high)) {
    tokenHourData.high = tokenPrice.toNumber()
  }

  if (tokenPrice.lt(tokenHourData.low)) {
    tokenHourData.low = tokenPrice.toNumber()
  }

  tokenHourData.close = tokenPrice.toNumber()
  tokenHourData.priceUSD = tokenPrice.toNumber()
  tokenHourData.totalValueLocked = token.totalValueLocked
  tokenHourData.totalValueLockedUSD = token.totalValueLockedUSD;

  return await context.db.update(tokenHourDatas, { id: tokenHourID }).set(tokenHourData);
}