import { onchainTable, primaryKey, relations } from "ponder";
import { transactions } from "ponder:schema";
import { positions } from "./position";

export const transfers = onchainTable(
  "transfers",
  (t) => ({
    // transaction hash
    hash: t.text().notNull(),

    // log index
    logIndex: t.bigint().notNull(),

    // token id of position
    tokenId: t.bigint().notNull(),

    // address of previous owner
    from: t.text().notNull(),

    // address of new owner
    to: t.text().notNull(),

    // the EOA that initiated the tx
    origin: t.text().notNull(),

    // time of tx
    timestamp: t.bigint().notNull(),

    // pointer to transaction
    transaction: t.text().notNull(),

    // pointer to position
    position: t.bigint().notNull(),
  }),
  (t) => ({
    // transaction hash + '-' + log index
    pk: primaryKey({ columns: [t.hash, t.logIndex] }),
  })
);

export const transferRelations = relations(transfers, ({ one }) => ({
  transaction: one(transactions, { fields: [transfers.transaction], references: [transactions.id] }),

  position: one(positions, { fields: [transfers.position], references: [positions.id] }),
}));