import { onchainTable, primaryKey, relations } from "ponder";
import { transactions } from "ponder:schema";
import { positions } from "./positions";

export const subscriptions = onchainTable(
  "subscriptions",
  (t) => ({
    // transaction hash
    hash: t.text().notNull(),

    // log index
    // TODO: use bigint instead?
    logIndex: t.integer().notNull(),

    // token id of position subscribed to
    tokenId: t.bigint().notNull(),

    // address of subscriber
    // TODO: rename to subscriber?
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

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  transaction: one(transactions, { fields: [subscriptions.transaction], references: [transactions.id] }),

  position: one(positions, { fields: [subscriptions.position], references: [positions.id] }),
}));