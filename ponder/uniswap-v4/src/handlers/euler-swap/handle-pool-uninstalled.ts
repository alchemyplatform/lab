import { Context, Event } from "ponder:registry";
import { eulerHooks } from "ponder:schema";

export async function handlePoolUninstalled({ event, context }: { event: Event<"EulerSwap:PoolUninstalled">, context: Context }): Promise<void> {
  // ──────────────────────────────────────────────────────────────
  // Build the composite ID: eulerAccount-asset0-asset1
  // ──────────────────────────────────────────────────────────────
  const { eulerAccount, asset0, asset1, pool } = event.args;

  // ──────────────────────────────────────────────────────────────
  // Load (or create) the row for this tuple
  // ──────────────────────────────────────────────────────────────
  const entity = await context.db.find(eulerHooks, { eulerAccount, asset0, asset1 });

  if (entity != null && entity.hook == pool) {
    await context.db.delete(eulerHooks, { eulerAccount, asset0, asset1 });
  }
}