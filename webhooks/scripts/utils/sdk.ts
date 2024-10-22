import { parse } from "@valibot/valibot";
import { ResponseGetAllWebhooks } from "../../utils/schemas/api/get-all-webhooks.ts";
import {
  RequestGetAllAddresses,
  ResponseGetAllAddresses,
} from "../../utils/schemas/api/get-all-addresses.ts";

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
  async getAllAddresses(args: RequestGetAllAddresses) {
    const { webhookId, limit, after } = parse(RequestGetAllAddresses, args);

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
}
