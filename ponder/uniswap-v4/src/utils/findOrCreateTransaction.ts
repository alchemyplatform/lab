import { Context, Event } from "ponder:registry";
import { transactions } from "ponder:schema";

export async function findOrCreateTransaction(context: Context, event: Event) {
  let transaction = await context.db.find(transactions, { id: event.transaction.hash });

  if (transaction === null) {
    transaction = await context.db.insert(transactions).values({
      id: event.transaction.hash,
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
      // TODO: needs to be moved to transaction receipt
      // What does this mean?
      gasUsed: 0n,
      gasPrice: event.transaction.gasPrice ?? 0n,
    });
  }
  return transaction;
}