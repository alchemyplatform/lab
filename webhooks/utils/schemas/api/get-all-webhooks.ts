import {
  array,
  boolean,
  integer,
  literal,
  number,
  optional,
  pipe,
  strictObject,
} from "@valibot/valibot";
import { WebhookId, WebhookSigningKey, WebhookType } from "../shared.ts";
import { Network } from "../shared.ts";
import { Url } from "../shared.ts";

const Webhook = strictObject({
  id: WebhookId,
  network: Network,
  webhook_type: optional(WebhookType),
  webhook_url: Url,
  is_active: boolean(),
  time_created: pipe(number(), integer()),
  signing_key: WebhookSigningKey,
  version: literal("V2"),
});

export const ResponseGetAllWebhooks = strictObject({
  data: array(Webhook),
});
