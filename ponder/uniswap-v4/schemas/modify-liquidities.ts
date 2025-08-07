import { onchainTable, relations } from "ponder";
import { transactions } from "ponder:schema";

export const modifyLiquidities = onchainTable(
  "modify_liquidities",
  (t) => ({
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
  })
);

export const modifyLiquidityRelations = relations(modifyLiquidities, ({ one }) => ({
  transaction: one(transactions, { fields: [modifyLiquidities.transaction], references: [transactions.id] }),
}));