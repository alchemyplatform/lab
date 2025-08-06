import { ponder } from "ponder:registry";

ponder.on("PoolManager:Initialize", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("PoolManager:ModifyLiquidity", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("PoolManager:Swap", async ({ event, context }) => {
  console.log(event.args);
});