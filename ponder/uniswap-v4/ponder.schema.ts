import { onchainTable } from "ponder";

export const poolManagers = onchainTable("pool_managers", (t) => ({
  // poolManager address
  id: t.text().primaryKey(),

  // amount of pools created
  poolCount: t.bigint(),

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