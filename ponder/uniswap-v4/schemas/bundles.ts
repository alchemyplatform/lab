import { onchainTable } from "ponder";

export const bundles = onchainTable(
  "bundles",
  (t) => ({
    // bundle id
    id: t.text().primaryKey(),

    // price of ETH in usd
    ethPriceUSD: t.doublePrecision().notNull(),
  })
);