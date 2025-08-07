import { ponder } from "ponder:registry";
import { handleInitialize } from "./handlers/pool-manager/handle-initialize";
import { handleModifyLiquidity } from "./handlers/pool-manager/handle-modify-liquidity";

ponder.on("PoolManager:Initialize", async ({ event, context }) => {
  await handleInitialize({ event, context });
});

ponder.on("PoolManager:ModifyLiquidity", async ({ event, context }) => {
  await handleModifyLiquidity({ event, context });
});

ponder.on("PoolManager:Swap", async ({ event, context }) => {
  console.log(event.args);
});