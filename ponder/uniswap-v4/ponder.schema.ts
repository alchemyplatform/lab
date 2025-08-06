import { onchainTable, relations } from "ponder";

export const poolManagers = onchainTable("pool_managers", (t) => ({
  // poolManager address
  id: t.text().primaryKey(),

  // amount of pools created
  poolCount: t.bigint().notNull(),

  // amount of transactions all time
  txCount: t.bigint(),

  // total volume all time in derived USD
  totalVolumeUSD: t.doublePrecision(),

  // total volume all time in derived ETH
  totalVolumeETH: t.doublePrecision(),

  // total swap fees all time in USD
  totalFeesUSD: t.doublePrecision(),

  // total swap fees all time in USD
  totalFeesETH: t.doublePrecision(),

  // all volume even through less reliable USD values
  untrackedVolumeUSD: t.doublePrecision(),

  // TVL derived in USD
  totalValueLockedUSD: t.doublePrecision(),

  // TVL derived in ETH
  totalValueLockedETH: t.doublePrecision(),

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
  ethPriceUSD: t.doublePrecision(),
}));

export const pools = onchainTable("pools", (t) => ({
  // pool address
  id: t.text().primaryKey(),

  // creation
  createdAtTimestamp: t.bigint().notNull(),

  // block pool was created at
  createdAtBlockNumber: t.bigint().notNull(),
}));

export const poolsRelations = relations(pools, ({ one }) => ({
  token0: one(tokens),
  token1: one(tokens),
}));

export const tokens = onchainTable("tokens", (t) => ({
  //  token address
  id: t.text().primaryKey(),

  // token symbol
  symbol: t.text(),

  // token name
  name: t.text(),

  // token decimals
  decimals: t.bigint(),

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
  txCount: t.bigint(),

  // TODO: use relation instead?
  // number of pools containing this token
  poolCount: t.bigint(),

  // liquidity across all pools in token units
  totalValueLocked: t.doublePrecision(),

  // liquidity across all pools in derived USD
  totalValueLockedUSD: t.doublePrecision(),

  // TVL derived in USD untracked
  totalValueLockedUSDUntracked: t.doublePrecision(),

  // Note: for chains where ETH is not the native token, this will be the derived price of that chain's native token, effectively, this should be renamed derivedNative.
  derivedETH: t.doublePrecision(),

}));

export const tokensRelations = relations(tokens, ({ many }) => ({
  pools: many(pools),

  // pools token is in that are white listed for USD pricing
  whitelistPools: many(pools),
}));