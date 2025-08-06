import { ponder } from "ponder:registry";

ponder.on("PositionManager:Approval", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("PositionManager:ApprovalForAll", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("PositionManager:Subscription", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("PositionManager:Transfer", async ({ event, context }) => {
  console.log(event.args);
});
