import { Context, Event } from "ponder:registry";
import { loadTransaction } from "../../utils";
import { positions, transfers } from "ponder:schema";

export async function handleTransfer({ event, context }: {
  event: Event<"PositionManager:Transfer">,
  context: Context
}): Promise<void> {
  const { id: tokenId, from, to } = event.args;

  let position = await context.db.find(positions, { id: tokenId });
  if (position === null) {
    const origin = event.transaction.from;
    const createdAtTimestamp = event.block.timestamp;

    position = await context.db.insert(positions).values({
      id: tokenId,
      owner: to,
      origin,
      createdAtTimestamp,
    });
  } else {
    position = await context.db
      .update(positions, { id: tokenId })
      .set({ owner: to });
  }

  const transaction = await loadTransaction(context, event);

  const hash = event.transaction.hash;
  const logIndex = event.log.logIndex;
  const origin = event.transaction.from;
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