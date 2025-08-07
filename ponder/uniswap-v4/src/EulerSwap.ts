import { ponder } from "ponder:registry";
import { handlePoolDeployed } from "./handlers/euler-swap/handlePoolDeployed";
import { handlePoolUninstalled } from "./handlers/euler-swap/handlePoolUninstalled";

ponder.on("EulerSwap:PoolDeployed", async ({ event, context }) => {
  await handlePoolDeployed({ event, context });
});

ponder.on("EulerSwap:PoolUninstalled", async ({ event, context }) => {
  await handlePoolUninstalled({ event, context });
});