import { Context, Event } from "ponder:registry";
import { eulerHooks } from "ponder:schema";

export async function handlePoolDeployed({ event, context }: {
  event: Event<"EulerSwap:PoolDeployed">,
  context: Context
}) {
  // ──────────────────────────────────────────────────────────────
  // Build the composite ID: eulerAccount-asset0-asset1
  // ──────────────────────────────────────────────────────────────
  const { eulerAccount, asset0, asset1, pool } = event.args;

  // ──────────────────────────────────────────────────────────────
  // Load (or create) the row for this tuple
  // ──────────────────────────────────────────────────────────────
  let entity = await context.db.find(eulerHooks, { eulerAccount, asset0, asset1 });

  if (entity == null) {
    await context.db.insert(eulerHooks).values({
      eulerAccount,
      asset0,
      asset1,
      hook: pool,
    });
  } else {
    // Always overwrite the hook address so the latest hook is used
    await context.db
      .update(eulerHooks, { eulerAccount, asset0, asset1 })
      .set({ hook: pool });
  }
}