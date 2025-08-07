import { Context, Event } from "ponder:registry";
import { unsubscriptions } from "ponder:schema";
import { findOrCreateTransaction } from "../../utils/findOrCreateTransaction";

// same as handleSubscription - do we need to keep both?
export async function handleUnsubscription({ event, context }: {
  event: Event<"PositionManager:Unsubscription">,
  context: Context
}): Promise<void> {
  const { tokenId, subscriber } = event.args;

  const hash = event.transaction.hash;
  const logIndex = event.log.logIndex;
  const origin = event.transaction.from;

  const transaction = await findOrCreateTransaction(context, event);
  const timestamp = transaction.timestamp;

  await context.db.insert(unsubscriptions).values({
    hash,
    logIndex,
    tokenId,
    address: subscriber,
    origin,
    timestamp,
    transaction: transaction.id,
    position: tokenId,
  });
}