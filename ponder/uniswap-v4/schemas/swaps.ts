import { onchainTable, primaryKey, relations } from "ponder"
import { pools, tokens, transactions } from "ponder:schema";

export const swaps = onchainTable(
  'swaps',
  (t) => ({
    // transaction hash
    hash: t.text().notNull(),

    // index within the txn
    logIndex: t.integer().notNull(),

    // sender of the swap
    sender: t.text().notNull(),

    // recipient of the swap
    recipient: t.text().notNull(),

    // EOA that initiated the txn
    origin: t.text().notNull(),

    // delta of token0 swapped
    amount0: t.numeric({ mode: 'number' }).notNull(),

    // delta of token1 swapped
    amount1: t.numeric({ mode: 'number' }).notNull(),

    // derived info
    amountUSD: t.numeric({ mode: 'number' }).notNull(),

    // sqrt(price) of the pool after the swap, as a Q64.96
    sqrtPriceX96: t.bigint().notNull(),

    // the tick after the swap
    tick: t.bigint().notNull(),

    // timestamp of transaction
    timestamp: t.bigint().notNull(),

    // pointer to transaction
    // TODO: use relation
    transaction: t.text().notNull(),

    // pool swap occured within
    pool: t.text().notNull(),

    // allow indexing by tokens
    token0: t.text().notNull(),

    // allow indexing by tokens
    token1: t.text().notNull(),
  }),
  (t) => ({
    // transaction hash + "#" + index in swaps Transaction array
    pk: primaryKey({ columns: [t.hash, t.logIndex] }),
  })
)

export const swapsRelations = relations(swaps, ({ one }) => ({
  transaction: one(transactions, { fields: [swaps.transaction], references: [transactions.id] }),
  pool: one(pools, { fields: [swaps.pool], references: [pools.id] }),
  token0: one(tokens, { fields: [swaps.token0], references: [tokens.id] }),
  token1: one(tokens, { fields: [swaps.token1], references: [tokens.id] }),
}));