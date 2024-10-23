import {
  boolean,
  maxValue,
  minLength,
  minValue,
  number,
  optional,
  pipe,
  regex,
  strictObject,
  string,
} from "@valibot/valibot";
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

export const ResNftFilter = strictObject({
  // TODO: check types
  contract_address: string(),
  token_id: optional(string()),
});

// This validation is also usually done server side.
// Limit needs to be between 1 and 100 (inclusive).
export const PaginationLimit = optional(
  pipe(
    number(),
    minValue(1, "Limit must be between 1 and 100."),
    maxValue(100, "Limit must be between 1 and 100.")
  ),
  100
);

export const PaginationAfter = optional(pipe(string(), minLength(1)));

// Custom Webhook variable
export const Variable = pipe(
  string(),
  minLength(1, "Variable must be non empty string (e.g. myVariable)."),
  // https://stackoverflow.com/a/17481038
  regex(
    /^[A-Za-z0-9]*$/,
    "Variable must be alphanumeric string (e.g. myVariable)."
  )
);
