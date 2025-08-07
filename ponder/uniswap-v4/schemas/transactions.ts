import { onchainTable, relations } from "ponder";
import { modifyLiquidities } from "ponder:schema";

export const transactions = onchainTable(
  "transactions", (t) => ({
    // txn hash
    id: t.text().primaryKey(),

    // block txn was included in
    blockNumber: t.bigint().notNull(),

    // timestamp txn was confirmed
    timestamp: t.bigint().notNull(),

    // gas used during txn execution
    gasUsed: t.bigint().notNull(),

    gasPrice: t.bigint().notNull(),
  })
);

export const transactionsRelations = relations(transactions, ({ many }) => ({
  modifyLiquiditys: many(modifyLiquidities),
}));