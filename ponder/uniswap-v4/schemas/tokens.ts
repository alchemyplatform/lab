import { onchainTable, relations } from "ponder";
import { pools } from "ponder:schema";

export const tokens = onchainTable(
  "tokens",
  (t) => ({
    //  token address
    id: t.text().primaryKey(),

    // token symbol
    symbol: t.text().notNull(),

    // token name
    name: t.text().notNull(),

    // token decimals
    decimals: t.bigint().notNull(),

    // token total supply
    totalSupply: t.bigint().notNull(),

    // volume in token units
    volume: t.doublePrecision().notNull(),

    // volume in derived USD
    volumeUSD: t.doublePrecision().notNull(),

    // volume in USD even on pools with less reliable USD values
    untrackedVolumeUSD: t.doublePrecision().notNull(),

    // fees in USD
    feesUSD: t.doublePrecision().notNull(),

    // transactions across all pools that include this token
    txCount: t.bigint().notNull(),

    // TODO: use relation instead?
    // number of pools containing this token
    poolCount: t.bigint().notNull(),

    // liquidity across all pools in token units
    totalValueLocked: t.doublePrecision().notNull(),

    // liquidity across all pools in derived USD
    totalValueLockedUSD: t.doublePrecision().notNull(),

    // TVL derived in USD untracked
    totalValueLockedUSDUntracked: t.doublePrecision().notNull(),

    // Note: for chains where ETH is not the native token, this will be the derived price of that chain's native token, effectively, this should be renamed derivedNative.
    derivedETH: t.doublePrecision().notNull(),
  })
);

export const tokensRelations = relations(tokens, ({ many }) => ({
  pools: many(pools),

  // pools token is in that are white listed for USD pricing
  whitelistPools: many(pools),
}));