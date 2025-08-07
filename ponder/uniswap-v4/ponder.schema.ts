import { onchainTable, relations } from "ponder";
import { eulerHooks } from "./schemas/euler";

export const poolManagers = onchainTable("pool_managers", (t) => ({
  // poolManager address
  id: t.text().primaryKey(),

  // amount of pools created
  poolCount: t.bigint().notNull(),

  // amount of transactions all time
  txCount: t.bigint().notNull(),

  // total volume all time in derived USD
  totalVolumeUSD: t.doublePrecision().notNull(),

  // total volume all time in derived ETH
  totalVolumeETH: t.doublePrecision().notNull(),

  // total swap fees all time in USD
  totalFeesUSD: t.doublePrecision().notNull(),

  // total swap fees all time in USD
  totalFeesETH: t.doublePrecision().notNull(),

  // all volume even through less reliable USD values
  untrackedVolumeUSD: t.doublePrecision().notNull(),

  // TVL derived in USD
  totalValueLockedUSD: t.doublePrecision().notNull(),

  // TVL derived in ETH
  totalValueLockedETH: t.doublePrecision().notNull(),

  // TVL derived in USD untracked
  totalValueLockedUSDUntracked: t.doublePrecision(),

  // TVL derived in ETH untracked
  totalValueLockedETHUntracked: t.doublePrecision(),

  // current owner of the factory
  // TODO: create Owner entity?
  owner: t.text(),
}));

export const bundles = onchainTable("bundles", (t) => ({
  // bundle id
  id: t.text().primaryKey(),

  // price of ETH in usd
  ethPriceUSD: t.doublePrecision().notNull(),
}));

export const pools = onchainTable("pools", (t) => ({
  // pool address
  id: t.text().primaryKey(),

  // creation
  createdAtTimestamp: t.bigint().notNull(),

  // block pool was created at
  createdAtBlockNumber: t.bigint().notNull(),

  // token0 
  token0: t.text().notNull(),

  // token1
  token1: t.text().notNull(),

  // fee amount
  feeTier: t.bigint().notNull(),

  // in range liquidity
  liquidity: t.bigint().notNull(),

  // current price tracker
  sqrtPrice: t.bigint().notNull(),

  // token0 per token1
  token0Price: t.doublePrecision().notNull(),

  // token1 per token0
  token1Price: t.doublePrecision().notNull(),

  // current tick
  tick: t.bigint().notNull(),

  // tick spacing
  tickSpacing: t.bigint().notNull(),

  // current observation index
  observationIndex: t.bigint().notNull(),

  // all time token0 swapped
  volumeToken0: t.doublePrecision().notNull(),

  // all time token1 swapped
  volumeToken1: t.doublePrecision().notNull(),

  // all time USD swapped
  volumeUSD: t.doublePrecision().notNull(),

  // all time USD swapped, unfiltered for unreliable USD pools
  untrackedVolumeUSD: t.doublePrecision().notNull(),

  // fees in USD
  feesUSD: t.doublePrecision().notNull(),

  // all time number of transactions
  txCount: t.bigint().notNull(),

  // all time fees collected token0
  collectedFeesToken0: t.doublePrecision().notNull(),

  // all time fees collected token1
  collectedFeesToken1: t.doublePrecision().notNull(),

  // all time fees collected derived USD
  collectedFeesUSD: t.doublePrecision().notNull(),

  // total token 0 across all ticks
  totalValueLockedToken0: t.doublePrecision().notNull(),

  // total token 1 across all ticks 
  totalValueLockedToken1: t.doublePrecision().notNull(),

  // tvl derived ETH
  totalValueLockedETH: t.doublePrecision().notNull(),

  // tvl USD
  totalValueLockedUSD: t.doublePrecision().notNull(),

  // TVL derived in USD untracked
  totalValueLockedUSDUntracked: t.doublePrecision().notNull(),

  // Fields used to help derived relationship
  liquidityProviderCount: t.bigint().notNull(),

  // hooks address
  hooks: t.text().notNull(),
}));


export const poolsRelations = relations(pools, ({ one }) => ({
  token0: one(tokens, { fields: [pools.token0], references: [tokens.id] }),
  token1: one(tokens, { fields: [pools.token1], references: [tokens.id] }),
}));

export const tokens = onchainTable("tokens", (t) => ({
  //  token address
  id: t.text().primaryKey(),

  // token symbol
  symbol: t.text(),

  // token name
  name: t.text(),

  // token decimals
  decimals: t.bigint().notNull(),

  // token total supply
  totalSupply: t.bigint(),

  // volume in token units
  volume: t.doublePrecision(),

  // volume in derived USD
  volumeUSD: t.doublePrecision(),

  // volume in USD even on pools with less reliable USD values
  untrackedVolumeUSD: t.doublePrecision(),

  // fees in USD
  feesUSD: t.doublePrecision(),

  // transactions across all pools that include this token
  txCount: t.bigint().notNull(),

  // TODO: use relation instead?
  // number of pools containing this token
  poolCount: t.bigint(),

  // liquidity across all pools in token units
  totalValueLocked: t.doublePrecision().notNull(),

  // liquidity across all pools in derived USD
  totalValueLockedUSD: t.doublePrecision().notNull(),

  // TVL derived in USD untracked
  totalValueLockedUSDUntracked: t.doublePrecision().notNull(),

  // Note: for chains where ETH is not the native token, this will be the derived price of that chain's native token, effectively, this should be renamed derivedNative.
  derivedETH: t.doublePrecision().notNull(),
}));

export const tokensRelations = relations(tokens, ({ many }) => ({
  pools: many(pools),

  // pools token is in that are white listed for USD pricing
  whitelistPools: many(pools),
}));

export const ticks = onchainTable("ticks", (t) => ({

  // format: <pool address>#<tick index>
  id: t.text().primaryKey(),

  // pool address
  poolAddress: t.text().notNull(),

  // tick index
  tickIdx: t.bigint().notNull(),

  // pointer to pool
  // pool: t.text().notNull(),

  // total liquidity pool has as tick lower or upper
  liquidityGross: t.bigint().notNull(),

  // how much liquidity changes when tick crossed
  liquidityNet: t.bigint().notNull(),

  // calculated price of token0 of tick within this pool - constant
  price0: t.doublePrecision().notNull(),

  // calculated price of token1 of tick within this pool - constant
  price1: t.doublePrecision().notNull(),

  // created time
  createdAtTimestamp: t.bigint().notNull(),

  // created block
  createdAtBlockNumber: t.bigint().notNull(),
}));

export const ticksRelations = relations(ticks, ({ one }) => ({
  pool: one(pools, { fields: [ticks.poolAddress], references: [pools.id] }),
}));

export const transactions = onchainTable("transactions", (t) => ({
  // txn hash
  id: t.text().primaryKey(),
  // block txn was included in
  blockNumber: t.bigint().notNull(),
  // timestamp txn was confirmed
  timestamp: t.bigint().notNull(),
  // gas used during txn execution
  gasUsed: t.bigint().notNull(),
  gasPrice: t.bigint().notNull(),
}));

export const transactionsRelations = relations(transactions, ({ many }) => ({
  modifyLiquiditys: many(modifyLiquidities),
}));

export const modifyLiquidities = onchainTable("modify_liquidities", (t) => ({
  // transaction hash + "#" + index in mints Transaction array
  id: t.text().primaryKey(),
  // which txn the ModifyLiquidity was included in
  // TODO: use relation instead
  transaction: t.text().notNull(),
  // time of txn
  timestamp: t.bigint().notNull(),
  // pool position is within
  pool: t.text().notNull(),
  // token0
  token0: t.text().notNull(),
  // token1
  token1: t.text().notNull(),
  // owner of position where liquidity modified to
  sender: t.text().notNull(),
  // txn origin
  origin: t.text().notNull(),
  // amount of liquidity modified
  amount: t.bigint().notNull(),
  // amount of token 0 modified
  amount0: t.doublePrecision().notNull(),
  // amount of token 1 modified
  amount1: t.doublePrecision().notNull(),
  // derived amount based on available prices of tokens
  amountUSD: t.doublePrecision().notNull(),
  // lower tick of the position
  tickLower: t.bigint().notNull(),
  // upper tick of the position
  tickUpper: t.bigint().notNull(),
  // index within the txn
  logIndex: t.bigint().notNull(),
}));

export const modifyLiquidityRelations = relations(modifyLiquidities, ({ one }) => ({
  transaction: one(transactions, { fields: [modifyLiquidities.transaction], references: [transactions.id] }),
}));

export const uniswapDayDatas = onchainTable("uniswap_day_datas", (t) => ({
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
}));

export const poolDayDatas = onchainTable("pool_day_datas", (t) => ({
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
}));

export const poolHourDatas = onchainTable("pool_hour_datas", (t) => ({
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
}));

export const tokenDayDatas = onchainTable("token_day_datas", (t) => ({
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
}));

export const tokenHourDatas = onchainTable("token_hour_datas", (t) => ({
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
}));

export { eulerHooks };