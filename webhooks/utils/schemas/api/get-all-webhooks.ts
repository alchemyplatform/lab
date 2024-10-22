/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/team-webhooks
 */
import { array, boolean, optional, strictObject } from "@valibot/valibot";
import {
  Integer,
  WebhookId,
  WebhookSigningKey,
  WebhookType,
  WebhookVersion,
} from "../shared.ts";
import { Network } from "../shared.ts";
import { Url } from "../shared.ts";

const Webhook = strictObject({
  id: WebhookId,
  network: Network,
  webhook_type: optional(WebhookType),
  webhook_url: Url,
  is_active: boolean(),
  time_created: Integer,
  signing_key: WebhookSigningKey,
  version: WebhookVersion,
});

export const ResponseGetAllWebhooks = strictObject({
  data: array(Webhook),
});
