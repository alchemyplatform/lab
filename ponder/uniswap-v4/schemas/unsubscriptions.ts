import { onchainTable, primaryKey, relations } from "ponder";
import { transactions } from "ponder:schema";
import { positions } from "./position";

export const unsubscriptions = onchainTable(
  "unsubscriptions",
  (t) => ({
    // transaction hash
    hash: t.text().notNull(),

    // log index
    // TODO: use bigint instead?
    logIndex: t.integer().notNull(),

    // token id of position subscribed to
    tokenId: t.bigint().notNull(),

    // address of unsubscriber
    // TODO: rename to unsubscriber?
    address: t.text().notNull(),

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

export const unsubscriptionRelations = relations(unsubscriptions, ({ one }) => ({
  transaction: one(transactions, { fields: [unsubscriptions.transaction], references: [transactions.id] }),

  position: one(positions, { fields: [unsubscriptions.position], references: [positions.id] }),
}));