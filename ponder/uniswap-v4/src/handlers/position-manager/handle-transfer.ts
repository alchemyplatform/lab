import { Context, Event } from "ponder:registry";
import { positions } from "../../../schemas/position";
import { transfers } from "../../../schemas/transfer";
import { loadTransaction } from "../../utils";

export async function handleTransfer({ event, context }: { event: Event<"PositionManager:Transfer">, context: Context }): Promise<void> {
  console.log(event.args);

  const { id: tokenId, from, to } = event.args;

  let position = await context.db.find(positions, { id: tokenId });
  if (position === null) {
    const origin = event.transaction.from;
    const createdAtTimestamp = event.block.timestamp;

    position = await context.db.insert(positions).values({
      id: tokenId,
      origin,
      createdAtTimestamp,
      owner: to,
    });
  } else {
    position = await context.db
      .update(positions, { id: tokenId })
      .set({ owner: to });
  }


  const transaction = await loadTransaction(context, event);

  const hash = await event.transaction.hash;
  const logIndex = BigInt(event.log.logIndex);
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