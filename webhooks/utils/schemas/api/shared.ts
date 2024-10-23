import {
  array,
  boolean,
  maxLength,
  maxValue,
  minLength,
  minValue,
  number,
  optional,
  pipe,
  regex,
  strictObject,
  string,
  union,
} from "@valibot/valibot";
import {
  Address,
  Hash,
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

// TODO: add Byte32 schema? check if we can pass any string as items
export const VariableItems = pipe(
  array(union([Address, Hash]), "Item must be a valid address or hash"),
  minLength(1, "'items' should at least have one element"),
  maxLength(
    10_000,
    "'items' should have at most 10,000 elements - you can call the API multiple times."
  )
);
