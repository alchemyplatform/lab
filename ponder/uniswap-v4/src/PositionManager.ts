import { ponder } from "ponder:registry";
import { handleTransfer } from "./handlers/position-manager/handle-transfer";
import { handleUnsubscription } from "./handlers/position-manager/handle-unsubscription";

ponder.on("PositionManager:Transfer", async ({ event, context }) => {
  await handleTransfer({ event, context });
});

ponder.on("PositionManager:Unsubscription", async ({ event, context }) => {
  await handleUnsubscription({ event, context });
});