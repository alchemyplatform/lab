import {
  array,
  boolean,
  strictObject,
  string,
  union,
  variant,
  type InferInput,
} from "@valibot/valibot";
import {
  Address,
  Integer,
  Network,
  Url,
  WebhookId,
  WebhookSigningKey,
  WebhookType,
  WebhookTypeAddressActivity,
  WebhookTypeDroppedTransaction,
  WebhookTypeGraphQl,
  WebhookTypeMinedTransaction,
  WebhookTypeNftActivity,
  WebhookTypeNftMetadataUpdate,
  WebhookVersion,
} from "../shared.ts";

const BaseCreateWebhook = strictObject({
  network: Network,
  // TODO: replace with Url schema once Url is fixed
  url: string(),
});

const CreateGraphQlWebhook = strictObject({
  ...BaseCreateWebhook.entries,
  type: WebhookTypeGraphQl,
  graphQlQuery: union([
    string(),
    strictObject({
      query: string(),
      skipEmptyMessages: boolean(),
    }),
  ]),
});

const CreateAddressActivityWebhook = strictObject({
  ...BaseCreateWebhook.entries,
  type: WebhookTypeAddressActivity,
  addresses: array(Address),
});

const CreateNftActivityWebhook = strictObject({
  ...BaseCreateWebhook.entries,
  type: WebhookTypeNftActivity,
  nftFilters: array(
    strictObject({
      // TODO: check types
      contractAddress: string(),
      tokenId: string(),
    })
  ),
});

const CreateNftMetadataUpdateWebhook = strictObject({
  ...BaseCreateWebhook.entries,
  type: WebhookTypeNftMetadataUpdate,
  nftMetadataFilters: array(
    strictObject({
      contractAddress: string(),
      tokenId: string(),
    })
  ),
});

const CreateMinedTransactionWebhook = strictObject({
  ...BaseCreateWebhook.entries,
  type: WebhookTypeMinedTransaction,
  appId: string(),
});

const CreateDroppedTransactionWebhook = strictObject({
  ...BaseCreateWebhook.entries,
  type: WebhookTypeDroppedTransaction,
  appId: string(),
});

export type RequestCreateWebhook = InferInput<typeof RequestCreateWebhook>;
export const RequestCreateWebhook = variant("type", [
  CreateGraphQlWebhook,
  CreateAddressActivityWebhook,
  CreateNftActivityWebhook,
  CreateNftMetadataUpdateWebhook,
  CreateMinedTransactionWebhook,
  CreateDroppedTransactionWebhook,
]);

export const ResponseCreateWebhook = strictObject({
  data: strictObject({
    id: WebhookId,
    network: Network,
    webhook_type: WebhookType,
    // TODO: update Url schema
    webhook_url: Url,
    is_active: boolean(),
    time_created: Integer,
    signing_key: WebhookSigningKey,
    version: WebhookVersion,
  }),
});
