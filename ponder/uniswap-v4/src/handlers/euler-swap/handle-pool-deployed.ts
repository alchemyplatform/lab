import { Context, Event } from "ponder:registry";
import { eulerHooks } from "ponder:schema";

export async function handlePoolDeployed({ event, context }: {
  event: Event<"EulerSwap:PoolDeployed">,
  context: Context
}): Promise<void> {
  // ──────────────────────────────────────────────────────────────
  // Build the composite ID: eulerAccount-asset0-asset1
  // ──────────────────────────────────────────────────────────────
  const { eulerAccount, asset0, asset1, pool } = event.args;

  // create new row, update the row if there is a conflict
  await context.db
    .insert(eulerHooks)
    .values({
      eulerAccount,
      asset0,
      asset1,
      hook: pool,
    })
    // always overwrite the hook address so the latest hook is used
    .onConflictDoUpdate({ hook: pool })
}