import type { Context, MiddlewareHandler, Next } from "@hono/hono";
import { createMiddleware } from "@hono/hono/factory";
import { createHmac } from "node:crypto";

const HEADER_SIGNATURE = "X-Alchemy-Signature";

const TEST_SIGNING_KEY = "whsec_test";

type ValidateSignatureOptions = {
  signingKey: string | Map<string, string>;
  debug?: boolean;
};

async function getSigningKey({
  ctx,
  webhookIdToKey,
}: {
  ctx: Context;
  webhookIdToKey: Map<string, string>;
}): Promise<string> {
  const json = await ctx.req.json();
  const webhookId = json.webhookId;

  const key = webhookIdToKey.get(webhookId);
  if (!key) {
    throw new Error("No signing key found for webhookId: " + webhookId);
  }
  return key;
}

export const validateSignature = (
  options: ValidateSignatureOptions
): MiddlewareHandler => {
  const signingKey = options.signingKey;
  const debug = options.debug ?? false;

  if (debug) {
    console.debug("[validate-signature] => options.signingKey:", signingKey);
    console.debug("[validate-signature] => options.debug:", debug);
  }

  if (!signingKey) {
    if (debug) {
      console.debug("[validate-signature] => Error: No signing key provided.");
    }
    throw new Error(
      'validate signature middleware requires options for "signingKey"'
    );
  }

  return createMiddleware(async (ctx: Context, next: Next) => {
    try {
      const signature = ctx.req.header(HEADER_SIGNATURE);
      if (debug) {
        console.debug(
          `[validate-signature] => ${HEADER_SIGNATURE}: ${signature}`
        );
      }

      if (!signature) {
        const errMessage = `Missing header: ${HEADER_SIGNATURE}`;
        if (debug) {
          console.debug("[validate-signature] => Error:", errMessage);
        }
        throw new Error(errMessage);
      }

      const key =
        signingKey instanceof Map
          ? await getSigningKey({ ctx, webhookIdToKey: signingKey })
          : signingKey;

      const rawPayload = await ctx.req.text();
      if (debug) {
        console.debug("[validate-signature] => rawPayload:", rawPayload);
      }

      const hmac = createHmac("sha256", key);
      hmac.update(rawPayload, "utf8");

      const digest = hmac.digest("hex");
      const isValidSignature = digest === signature;

      if (debug) {
        console.debug(`[validate-signature] => digest: ${digest}
  [validate-signature] => signature: ${signature}
  [validate-signature] => isValid? (digest === signature): ${isValidSignature}`);
      }

      if (!isValidSignature) {
        throw new Error(
          "Invalid signature - make sure to include the correct signing secret. You can find it at https://dashboard.alchemy.com/webhooks or in the API response body when creating a new webhook."
        );
      }

      await next();
    } catch (err) {
      if (err instanceof Error) {
        const errMessage = `Error validating signature: ${err.message}`;
        console.error(errMessage);
        return ctx.json({ error: errMessage }, { status: 400 });
      }

      console.error("Unknown error validating signature");
      return ctx.json(
        { error: "Unknown error validating signature" },
        { status: 400 }
      );
    }
  });
};
