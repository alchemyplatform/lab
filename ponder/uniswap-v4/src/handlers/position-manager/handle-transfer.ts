import { Context, Event } from "ponder:registry";

export async function handleTransfer({ event, context }: { event: Event<"PositionManager:Transfer">, context: Context }): Promise<void> {
  console.log(event.args);
}