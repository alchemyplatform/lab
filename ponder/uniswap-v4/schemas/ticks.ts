import { onchainTable, relations } from "ponder";
import { pools } from "ponder:schema";

export const ticks = onchainTable(
  "ticks",
  (t) => ({

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
  })
);

export const ticksRelations = relations(ticks, ({ one }) => ({
  pool: one(pools, { fields: [ticks.poolAddress], references: [pools.id] }),
}));
