import type { Context, MiddlewareHandler, Next } from "@hono/hono";
import { createMiddleware } from "@hono/hono/factory";
import { createHmac } from "node:crypto";

const HEADER_SIGNATURE = "X-Alchemy-Signature";

type ValidateSignatureOptions = {
  signingKey: string;
  debug?: boolean;
};

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

    const rawPayload = await ctx.req.text();
    if (debug) {
      console.debug("[validate-signature] => rawPayload:", rawPayload);
    }

    const hmac = createHmac("sha256", signingKey);
    hmac.update(rawPayload, "utf8");

    const digest = hmac.digest("hex");
    const isValidSignature = digest === signature;

    if (debug) {
      console.debug(`[validate-signature] => digest: ${digest}
[validate-signature] => signature: ${signature}
[validate-signature] => isValid? (digest === signature): ${isValidSignature}`);
    }

    if (!isValidSignature) {
      throw new Error("Invalid signature");
    }

    await next();
  });
};
