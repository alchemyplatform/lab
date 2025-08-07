import { onchainTable } from "ponder";

export const uniswapDayDatas = onchainTable(
  "uniswap_day_datas",
  (t) => ({
    // timestamp rounded to current day by dividing by 86400
    id: t.text().primaryKey(),

    // timestamp rounded to current day by dividing by 86400
    date: t.bigint().notNull(),

    // total daily volume in Uniswap derived in terms of ETH
    volumeETH: t.doublePrecision().notNull(),

    // total daily volume in Uniswap derived in terms of USD
    volumeUSD: t.doublePrecision().notNull(),

    // total daily volume in Uniswap derived in terms of USD untracked
    volumeUSDUntracked: t.doublePrecision().notNull(),

    // fees in USD
    feesUSD: t.doublePrecision().notNull(),

    // number of daily transactions
    txCount: t.bigint().notNull(),

    // tvl in terms of USD
    tvlUSD: t.doublePrecision().notNull(),
  })
);

export const poolDayDatas = onchainTable(
  "pool_day_datas", (t) => ({
    // timestamp rounded to current day by dividing by 86400
    id: t.text().primaryKey(),

    // timestamp rounded to current day by dividing by 86400
    date: t.bigint().notNull(),

    // pointer to pool
    pool: t.text().notNull(),

    // in range liquidity at end of period
    liquidity: t.bigint().notNull(),

    // current price tracker at end of period
    sqrtPrice: t.bigint().notNull(),

    // price of token0 - derived from sqrtPrice
    token0Price: t.doublePrecision().notNull(),

    // price of token1 - derived from sqrtPrice
    token1Price: t.doublePrecision().notNull(),

    // current tick at end of period
    tick: t.bigint(),

    // tvl derived in USD at end of period
    tvlUSD: t.doublePrecision().notNull(),

    // volume in token0
    volumeToken0: t.doublePrecision().notNull(),

    // volume in token1
    volumeToken1: t.doublePrecision().notNull(),

    // volume in USD
    volumeUSD: t.doublePrecision().notNull(),

    // fees in USD
    feesUSD: t.doublePrecision().notNull(),

    // number of transactions during period
    txCount: t.bigint().notNull(),

    // opening price of token0
    open: t.doublePrecision().notNull(),

    // high price of token0
    high: t.doublePrecision().notNull(),

    // low price of token0
    low: t.doublePrecision().notNull(),

    // close price of token0
    close: t.doublePrecision().notNull(),
  })
);

export const poolHourDatas = onchainTable(
  "pool_hour_datas",
  (t) => ({
    // format: <pool address>-<timestamp>
    id: t.text().primaryKey(),

    // unix timestamp for start of hour
    periodStartUnix: t.bigint().notNull(),

    // pointer to pool
    pool: t.text().notNull(),

    // in range liquidity at end of period
    liquidity: t.bigint().notNull(),

    // current price tracker at end of period
    sqrtPrice: t.bigint().notNull(),

    // price of token0 - derived from sqrtPrice
    token0Price: t.doublePrecision().notNull(),

    // price of token1 - derived from sqrtPrice
    token1Price: t.doublePrecision().notNull(),

    // current tick at end of period
    tick: t.bigint(),

    // tvl derived in USD at end of period
    tvlUSD: t.doublePrecision().notNull(),

    // volume in token0
    volumeToken0: t.doublePrecision().notNull(),

    // volume in token1
    volumeToken1: t.doublePrecision().notNull(),

    // volume in USD
    volumeUSD: t.doublePrecision().notNull(),

    // fees in USD
    feesUSD: t.doublePrecision().notNull(),

    // number of transactions during period
    txCount: t.bigint().notNull(),

    // opening price of token0
    open: t.doublePrecision().notNull(),

    // high price of token0
    high: t.doublePrecision().notNull(),

    // low price of token0
    low: t.doublePrecision().notNull(),

    // close price of token0
    close: t.doublePrecision().notNull(),
  })
);

export const tokenDayDatas = onchainTable(
  "token_day_datas",
  (t) => ({
    // token address concatenated with date
    id: t.text().primaryKey(),

    // timestamp rounded to current day by dividing by 86400
    date: t.bigint().notNull(),

    // pointer to token
    token: t.text().notNull(),

    // volume in token units
    volume: t.doublePrecision().notNull(),

    // volume in derived USD
    volumeUSD: t.doublePrecision().notNull(),

    // volume in USD even on pools with less reliable USD values
    untrackedVolumeUSD: t.doublePrecision().notNull(),

    // liquidity across all pools in token units
    totalValueLocked: t.doublePrecision().notNull(),

    // liquidity across all pools in derived USD
    totalValueLockedUSD: t.doublePrecision().notNull(),

    // price at end of period in USD
    priceUSD: t.doublePrecision().notNull(),

    // fees in USD
    feesUSD: t.doublePrecision().notNull(),

    // opening price USD
    open: t.doublePrecision().notNull(),

    // high price USD
    high: t.doublePrecision().notNull(),

    // low price USD
    low: t.doublePrecision().notNull(),

    // close price USD
    close: t.doublePrecision().notNull(),
  })
);

export const tokenHourDatas = onchainTable(
  "token_hour_datas",
  (t) => ({
    // token address concatenated with date
    id: t.text().primaryKey(),

    // unix timestamp for start of hour
    periodStartUnix: t.bigint().notNull(),

    // pointer to token
    token: t.text().notNull(),

    // volume in token units
    volume: t.doublePrecision().notNull(),

    // volume in derived USD
    volumeUSD: t.doublePrecision().notNull(),

    // volume in USD even on pools with less reliable USD values
    untrackedVolumeUSD: t.doublePrecision().notNull(),

    // liquidity across all pools in token units
    totalValueLocked: t.doublePrecision().notNull(),

    // liquidity across all pools in derived USD
    totalValueLockedUSD: t.doublePrecision().notNull(),

    // price at end of period in USD
    priceUSD: t.doublePrecision().notNull(),

    // fees in USD
    feesUSD: t.doublePrecision().notNull(),

    // opening price USD
    open: t.doublePrecision().notNull(),

    // high price USD
    high: t.doublePrecision().notNull(),

    // low price USD
    low: t.doublePrecision().notNull(),

    // close price USD
    close: t.doublePrecision().notNull(),
  })
);