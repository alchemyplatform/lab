/***
 *
 *
 * Docs - https://docs.alchemy.com/reference/team-webhooks
 */
import {
  array,
  boolean,
  literal,
  optional,
  strictObject,
} from "@valibot/valibot";
import {
  Integer,
  WebhookId,
  WebhookSigningKey,
  WebhookType,
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
  version: literal("V2"),
});

export const ResponseGetAllWebhooks = strictObject({
  data: array(Webhook),
});
