import { Context, Event } from "ponder:registry";

export async function handlePoolDeployed({ event, context }: { event: Event<"EulerSwap:PoolDeployed">, context: Context }) {
  console.log(event.args);
}