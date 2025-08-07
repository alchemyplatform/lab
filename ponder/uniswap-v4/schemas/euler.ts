import { onchainTable, primaryKey } from "ponder";

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