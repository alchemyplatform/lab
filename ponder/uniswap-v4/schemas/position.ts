import { onchainTable } from "ponder";

export const positions = onchainTable("positions", (t) => ({
  // tokenId
  id: t.bigint().primaryKey(),

  // address of current owner
  owner: t.text().notNull(),

  // the EOA that minted the position
  origin: t.text().notNull(),

  // created time
  createdAtTimestamp: t.bigint().notNull(),
}));