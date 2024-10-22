import { parse } from "@valibot/valibot";
import { ResponseGetAllWebhooks } from "../../utils/schemas/api/get-all-webhooks.ts";
import {
  RequestGetAllAddresses,
  ResponseGetAllAddresses,
} from "../../utils/schemas/api/get-all-addresses.ts";
import {
  RequestCreateWebhook,
  ResponseCreateWebhook,
} from "../../utils/schemas/api/create-webhook.ts";
import {
  RequestAddRemoveAddresses,
  ResponseAddRemoveAddresses,
} from "../../utils/schemas/api/add-remove-addresses.ts";
import {
  RequestReplaceAddresses,
  ResponseReplaceAddresses,
} from "../../utils/schemas/api/replace-addresses.ts";
import {
  RequestUpdateStatus,
  ResponseUpdateStatus,
} from "../../utils/schemas/api/update-webhook-status.ts";
import {
  RequestUpdateNftFilters,
  ResponseUpdateNftFilters,
} from "../../utils/schemas/api/update-webhook-nft-filters.ts";
import {
  RequestUpdateNftMetadataFilters,
  ResponseUpdateNftMetadataFilters,
} from "../../utils/schemas/api/update-webhook-nft-metadata-filters.ts";

type RequestGetWebhook = {
  webhookId: string;
};

export class WebhookSdk {
  private authToken: string;

  constructor({ authToken }: { authToken: string }) {
    if (!authToken) {
      throw new Error("authToken is required");
    }
    this.authToken = authToken;
  }

  private async _getAllWebhooks() {
    const url = "https://dashboard.alchemy.com/api/team-webhooks";
    const response = await fetch(url, {
      headers: {
        "X-Alchemy-Token": `${this.authToken}`,
      },
    });
    const json = await response.json();
    return parse(ResponseGetAllWebhooks, json);
  }

  async getAll() {
    return this._getAllWebhooks();
  }

  // TODO: add more client filters
  async get({ webhookId }: RequestGetWebhook) {
    const webhooks = await this._getAllWebhooks();
    const found = webhooks.data.find((wh) => wh.id === webhookId);
    if (!found) {
      throw new Error(`Webhook with ID ${webhookId} not found`);
    }
    return found;
  }

  // TODO: rename to filter?
  // TODO: check if address webhook of type ADDRESS_ACTIVITY
  async getAllAddresses(params: RequestGetAllAddresses) {
    const { webhookId, limit, after } = parse(RequestGetAllAddresses, params);

    const entries = [
      ["webhook_id", webhookId],
      ["limit", limit.toString()],
      ["after", after],
    ];
    const filteredEntries = entries.filter(([, value]) => value) as [
      string,
      string
    ][];
    const queryParams = new URLSearchParams(filteredEntries);
    const qs = queryParams.size > 1 ? `?${queryParams.toString()}` : "";
    const url = `https://dashboard.alchemy.com/api/webhook-addresses${qs}`;
    console.log(url);

    const response = await fetch(url, {
      headers: {
        "X-Alchemy-Token": `${this.authToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch addresses: ${
          response.statusText
        } ${await response.text()}`
      );
    }
    const json = await response.json();
    return parse(ResponseGetAllAddresses, json);
  }

  async create(params: RequestCreateWebhook) {
    const args = parse(RequestCreateWebhook, params);

    // TODO: refactor below in function

    const {
      type: webhookType,
      network: webhookNetwork,
      url: webhookUrl,
    } = args;

    const baseFields = {
      network: webhookNetwork,
      webhook_type: webhookType,
      webhook_url: webhookUrl,
    };

    let body = null;
    switch (webhookType) {
      case "GRAPHQL": {
        body = {
          ...baseFields,
          graphql_query:
            typeof args.graphQlQuery === "string"
              ? args.graphQlQuery
              : {
                  query: args.graphQlQuery.query,
                  skip_empty_messages: args.graphQlQuery.skipEmptyMessages,
                },
        };
        break;
      }

      case "ADDRESS_ACTIVITY": {
        body = {
          ...baseFields,
          addresses: args.addresses,
        };
        break;
      }

      case "NFT_ACTIVITY": {
        body = {
          ...baseFields,
          nft_filters: args.nftFilters.map(({ contractAddress, tokenId }) => ({
            contract_address: contractAddress,
            token_id: tokenId,
          })),
        };
        break;
      }

      case "NFT_METADATA_UPDATE": {
        body = {
          ...baseFields,
          nft_metadata_filters: args.nftMetadataFilters.map(
            ({ contractAddress, tokenId }) => ({
              contract_address: contractAddress,
              token_id: tokenId,
            })
          ),
        };
        break;
      }

      case "MINED_TRANSACTION":
      case "DROPPED_TRANSACTION": {
        body = {
          ...baseFields,
          app_id: args.appId,
        };
        break;
      }
    }

    const url = "https://dashboard.alchemy.com/api/create-webhook";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Alchemy-Token": this.authToken,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return parse(ResponseCreateWebhook, json);
  }

  // TODO: rename this
  async addRemoveAddresses(params: RequestAddRemoveAddresses) {
    const { webhookId, addressesToAdd, addressesToRemove } = parse(
      RequestAddRemoveAddresses,
      params
    );
    const body = {
      webhook_id: webhookId,
      addresses_to_add: addressesToAdd,
      addresses_to_remove: addressesToRemove,
    };
    const url = "https://dashboard.alchemy.com/api/update-webhook-addresses";
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Alchemy-Token": this.authToken,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return parse(ResponseAddRemoveAddresses, json);
  }

  // TODO: rename this
  async replaceAddresses(params: RequestReplaceAddresses) {
    const { webhookId, addresses } = parse(RequestReplaceAddresses, params);
    const body = {
      webhook_id: webhookId,
      addresses,
    };
    const url = "https://dashboard.alchemy.com/api/update-webhook-addresses";
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Alchemy-Token": this.authToken,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return parse(ResponseReplaceAddresses, json);
  }

  async updateStatus(params: RequestUpdateStatus) {
    const { webhookId, isActive } = parse(RequestUpdateStatus, params);
    const body = {
      webhook_id: webhookId,
      is_active: isActive,
    };
    const url = "https://dashboard.alchemy.com/api/update-webhook";
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Alchemy-Token": this.authToken,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return parse(ResponseUpdateStatus, json);
  }

  async updateNftFilters(args: RequestUpdateNftFilters) {
    const { webhookId, nftFiltersToAdd, nftFiltersToRemove } = parse(
      RequestUpdateNftFilters,
      args
    );
    const body = {
      webhook_id: webhookId,
      nft_filters_to_add: nftFiltersToAdd,
      nft_filters_to_remove: nftFiltersToRemove,
    };
    const url = "https://dashboard.alchemy.com/api/update-webhook-nft-filters";
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Alchemy-Token": this.authToken,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return parse(ResponseUpdateNftFilters, json);
  }

  async updateMetadataNftFilters(args: RequestUpdateNftMetadataFilters) {
    const { webhookId, nftMetadataFiltersToAdd, nftMetadataFiltersToRemove } =
      parse(RequestUpdateNftMetadataFilters, args);
    const body = {
      webhook_id: webhookId,
      nft_metadata_filters_to_add: nftMetadataFiltersToAdd,
      nft_metadata_filters_to_remove: nftMetadataFiltersToRemove,
    };
    const url =
      "https://dashboard.alchemy.com/api/update-webhook-nft-metadata-filters";
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Alchemy-Token": this.authToken,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return parse(ResponseUpdateNftMetadataFilters, json);
  }
}
