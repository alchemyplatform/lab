import { ponder } from "ponder:registry";

ponder.on("PoolManager:Approval", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("PoolManager:Donate", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("PoolManager:Initialize", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("PoolManager:ModifyLiquidity", async ({ event, context }) => {
  console.log(event.args);
});
