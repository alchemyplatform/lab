import Decimal from 'decimal.js';
import { safeDiv } from './index'
import { Context, Event } from 'ponder:registry';
import { ticks } from 'ponder:schema';

export async function createTick(context: Context, tickId: string, tickIdx: bigint, poolId: string, event: Event) {
  const price0 = Decimal('1.0001').pow(tickIdx);

  const tick = await context.db.insert(ticks).values({
    id: tickId,
    tickIdx: tickIdx,
    pool: poolId,
    poolAddress: poolId,
    createdAtTimestamp: event.block.timestamp,
    createdAtBlockNumber: event.block.number,
    liquidityGross: 0n,
    liquidityNet: 0n,
    // 1.0001^tick is token1/token0.
    price0: price0.toNumber(),
    price1: safeDiv(Decimal('1'), price0).toNumber(),
  });

  return tick;
}