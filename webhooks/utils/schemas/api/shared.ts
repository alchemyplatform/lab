import { boolean, optional, strictObject, string } from "@valibot/valibot";
import {
  Integer,
  WebhookId,
  WebhookSigningKey,
  WebhookType,
  WebhookVersion,
} from "../shared.ts";
import { Network } from "../shared.ts";
import { Url } from "../shared.ts";

export const Webhook = strictObject({
  id: WebhookId,
  network: Network,
  webhook_type: optional(WebhookType),
  webhook_url: Url,
  is_active: boolean(),
  time_created: Integer,
  signing_key: WebhookSigningKey,
  version: WebhookVersion,
});

export const NftFilter = strictObject({
  // TODO: check types
  contractAddress: string(),
  tokenId: string(),
});
