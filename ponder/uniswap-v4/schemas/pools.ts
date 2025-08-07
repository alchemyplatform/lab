import { onchainTable, relations } from "ponder";
import { tokens } from "ponder:schema";

export const pools = onchainTable(
  "pools",
  (t) => ({
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
  })
);


export const poolsRelations = relations(pools, ({ one }) => ({
  token0: one(tokens, { fields: [pools.token0], references: [tokens.id] }),
  token1: one(tokens, { fields: [pools.token1], references: [tokens.id] }),
}));