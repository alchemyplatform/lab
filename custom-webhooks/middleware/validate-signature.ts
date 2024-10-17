import type { Context, MiddlewareHandler, Next } from "@hono/hono";
import { createMiddleware } from "@hono/hono/factory";
import { createHmac } from "node:crypto";

const TEST_WEBHOOK_SIGNING_KEY = "whsec_test";
const HEADER_SIGNATURE = "X-Alchemy-Signature";

type ValidateSignatureOptions = {
  signingKey?: string;
  // For testing purposes only. Do not use in production.
  test?: boolean;
  debug?: boolean;
};

type CheckSignatureInput = {
  rawPayload: string;
  signature: string;
  signingKey: string;
};

type CheckSignatureOutput = {
  digest: string;
  isValid: boolean;
};

function checkSignature({
  rawPayload,
  signature,
  signingKey,
}: CheckSignatureInput): CheckSignatureOutput {
  const hmac = createHmac("sha256", signingKey);
  hmac.update(rawPayload, "utf8");
  const digest = hmac.digest("hex");
  const isValid = digest === signature;
  return {
    digest,
    isValid,
  };
}

export const validateSignature = (
  options: ValidateSignatureOptions
): MiddlewareHandler => {
  let signingKey = options.signingKey;
  const test = options.test ?? false;
  const debug = options.debug ?? false;

  if (debug) {
    console.debug("[validate-signature] => options.signingKey:", signingKey);
    console.debug("[validate-signature] => options.debug:", debug);
  }

  if (!signingKey) {
    if (!test) {
      if (debug) {
        console.debug(
          "[validate-signature] => Error: No signing key provided."
        );
      }
      throw new Error(
        'validate signature middleware requires options for "signingKey"'
      );
    }
    signingKey = TEST_WEBHOOK_SIGNING_KEY;
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

    const { digest, isValid } = checkSignature({
      rawPayload,
      signature,
      signingKey,
    });

    if (debug) {
      console.debug(`[validate-signature] => digest: ${digest}
[validate-signature] => signature: ${signature}
[validate-signature] => digest === signature: ${isValid}`);
    }

    if (!isValid) {
      if (signingKey !== TEST_WEBHOOK_SIGNING_KEY) {
        throw new Error("Invalid signature");
      }

      if (signingKey === TEST_WEBHOOK_SIGNING_KEY) {
        throw new Error("Invalid signature");
      }

      // Fallback to checking against the test signing key
      const { isValid: testIsValid } = checkSignature({
        rawPayload,
        signature,
        signingKey,
      });

      if (!testIsValid) {
        throw new Error("Invalid test signature");
      }

      ctx.header("X-Alchemy-Test-Payload", "1");
    } else {
      ctx.header("X-Alchemy-Test-Payload", "0");
    }

    await next();
  });
};
