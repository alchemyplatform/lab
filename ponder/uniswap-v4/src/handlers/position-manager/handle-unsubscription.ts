import { Context, Event } from "ponder:registry";

export async function handleUnsubscription({ event, context }: { event: Event<"PositionManager:Unsubscription">, context: Context }): Promise<void> {
  console.log(event.args);
}