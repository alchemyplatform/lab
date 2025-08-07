import { ponder } from "ponder:registry";
import { handleInitialize } from "./handlers/pool-manager/handleInitialize";
import { handleModifyLiquidity } from "./handlers/pool-manager/handleModifyLiquidity";

ponder.on("PoolManager:Initialize", async ({ event, context }) => {
  await handleInitialize({ event, context });
});

ponder.on("PoolManager:ModifyLiquidity", async ({ event, context }) => {
  await handleModifyLiquidity({ event, context });
});

ponder.on("PoolManager:Swap", async ({ event, context }) => {
  console.log(event.args);
});