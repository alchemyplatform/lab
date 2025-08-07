import { Context, Event } from "ponder:registry";

export async function handleSubscription({ event, context }: { event: Event<"PositionManager:Subscription">, context: Context }): Promise<void> {
  console.log(event.args);
}