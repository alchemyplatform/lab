import { Context, Event } from "ponder:registry";

export async function handlePoolUninstalled({ event, context }: { event: Event<"EulerSwap:PoolUninstalled">, context: Context }) {
  console.log(event.args);
}