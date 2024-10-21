import { parse } from "@valibot/valibot";
import { ResponseGetAllWebhooks } from "../../utils/schemas/api/get-all-webhooks.ts";

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

  async get({ webhookId }: RequestGetWebhook) {
    const webhooks = await this._getAllWebhooks();
    const found = webhooks.data.find((wh) => wh.id === webhookId);
    if (!found) {
      throw new Error(`Webhook with ID ${webhookId} not found`);
    }
    return found;
  }
}
