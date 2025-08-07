import { onchainTable, primaryKey, relations } from "ponder";

export const positions = onchainTable(
  "positions",
  (t) => ({
    // tokenId
    id: t.bigint().primaryKey(),

    // address of current owner
    owner: t.text().notNull(),

    // the EOA that minted the position
    origin: t.text().notNull(),

    // created time
    createdAtTimestamp: t.bigint().notNull(),
  })
);

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

export const transfers = onchainTable(
  "transfers",
  (t) => ({
    // transaction hash
    hash: t.text().notNull(),

    // log index
    // TODO: use bigint instead?
    logIndex: t.integer().notNull(),

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


// TODO: same as subscriptions - do we need 2 tables?
export const unsubscriptions = onchainTable(
  "unsubscriptions",
  (t) => ({
    // transaction hash
    hash: t.text().notNull(),

    // log index
    // TODO: use bigint instead?
    logIndex: t.integer().notNull(),

    // token id of position unsubscribed from
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

export const eulerHooks = onchainTable(
  "euler_hooks",
  (t) => ({
    // The latest hook address for this key
    hook: t.text().notNull(),

    // address of the euler account
    eulerAccount: t.text().notNull(),

    // address of asset0
    asset0: t.text().notNull(),

    // address of asset1
    asset1: t.text().notNull(),
  }),
  (table) => ({
    // Composite key = eulerAccount-asset0-asset1
    pk: primaryKey({ columns: [table.eulerAccount, table.asset0, table.asset1] }),
  })
);