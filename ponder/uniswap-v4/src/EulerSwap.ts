import { ponder } from "ponder:registry";
import { handlePoolDeployed } from "./handlers/euler-swap/handle-pool-deployed";
import { handlePoolUninstalled } from "./handlers/euler-swap/handle-pool-uninstalled";

ponder.on("EulerSwap:PoolDeployed", async ({ event, context }) => {
  await handlePoolDeployed({ event, context });
});

ponder.on("EulerSwap:PoolUninstalled", async ({ event, context }) => {
  await handlePoolUninstalled({ event, context });
});