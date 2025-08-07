import { Context, Event } from "ponder:registry";

export async function handleSwap({ event, context }: { event: Event<"PoolManager:Swap">, context: Context }) {
  console.log(event.args);
}