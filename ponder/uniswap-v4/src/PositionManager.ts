import { ponder } from "ponder:registry";
import { handleTransfer } from "./handlers/position-manager/handle-transfer";

ponder.on("PositionManager:Transfer", async ({ event, context }) => {
  await handleTransfer({ event, context });
});