/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/team-webhooks
 */

import { array, strictObject } from "@valibot/valibot";
import { Webhook } from "./shared.ts";

export const ResponseGetAllWebhooks = strictObject({
  data: array(Webhook),
});
