import { Context, Event } from "ponder:registry";
import { positions, transfers } from "ponder:schema";
import { findOrCreateTransaction } from "../../utils/findOrCreateTransaction";

export async function handleTransfer({ event, context }: {
  event: Event<"PositionManager:Transfer">,
  context: Context
}): Promise<void> {
  const { id: tokenId, from, to } = event.args;

  const origin = event.transaction.from;
  const createdAtTimestamp = event.block.timestamp;

  const position = await context.db
    .insert(positions)
    .values({
      id: tokenId,
      owner: to,
      origin,
      createdAtTimestamp,
    })
    .onConflictDoUpdate({ owner: to });

  const transaction = await findOrCreateTransaction(context, event);

  const hash = event.transaction.hash;
  const logIndex = event.log.logIndex;
  const timestamp = event.block.timestamp;

  await context.db
    .insert(transfers)
    .values({
      hash,
      logIndex,
      tokenId,
      from,
      to,
      origin,
      timestamp,
      transaction: transaction.id,
      position: position.id,
    });
}