import { Context, Event } from "ponder:registry";
import { subscriptions } from "ponder:schema";
import { findOrCreateTransaction } from "../../utils/findOrCreateTransaction";

export async function handleSubscription({ event, context }: {
  event: Event<"PositionManager:Subscription">,
  context: Context
}): Promise<void> {
  const { tokenId, subscriber } = event.args;

  const hash = event.transaction.hash;
  const logIndex = event.log.logIndex;
  const origin = event.transaction.from;

  const transaction = await findOrCreateTransaction(context, event);
  const timestamp = transaction.timestamp;

  await context.db.insert(subscriptions).values({
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

