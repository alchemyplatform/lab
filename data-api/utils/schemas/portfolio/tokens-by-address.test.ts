import { assert } from "jsr:@std/assert/assert";
import { safeParse } from "jsr:@valibot/valibot";
import {
  TokensByAddressRequestSchema,
  TokensByAddressResponseSchema,
} from "./tokens-by-address.ts";

const responseFixturePaths = [
  "./payloads/portfolio/tokens-by-address/test-payload-single-wallet-network.json",
  "./payloads/portfolio/tokens-by-address/test-payload-multi-wallet-network.json",
];
const requestFixturePath =
  "./payloads/portfolio/tokens-by-address/test-request.json";

const alchemyApiKeyEnvVar = "ALCHEMY_API_KEY";
const alchemyApiKeyPermission = Deno.permissions.querySync({
  name: "env",
  variable: alchemyApiKeyEnvVar,
});
const alchemyApiKey = alchemyApiKeyPermission.state === "granted"
  ? Deno.env.get(alchemyApiKeyEnvVar)?.trim() ?? ""
  : "";
const shouldRunLiveApiTest = alchemyApiKey.length > 0;

// Test request fixture
Deno.test("tokens by address request fixture is valid", async () => {
  const payload = JSON.parse(await Deno.readTextFile(requestFixturePath));

  const result = safeParse(TokensByAddressRequestSchema, payload);

  assert(result.success, JSON.stringify(result.issues, null, 2));
});

// Test response fixtures
for (const fixturePath of responseFixturePaths) {
  Deno.test(`tokens by address response fixture is valid: ${fixturePath}`, async () => {
    const payload = JSON.parse(await Deno.readTextFile(fixturePath));

    const result = safeParse(TokensByAddressResponseSchema, payload);

    assert(result.success, JSON.stringify(result.issues, null, 2));
  });
}

Deno.test({
  name: "tokens by address live API response is valid",
  // Not ignored if an API key exists
  ignore: !shouldRunLiveApiTest,
  async fn() {
    const requestPayload = JSON.parse(
      await Deno.readTextFile(requestFixturePath),
    );
    const response = await fetch(
      `https://api.g.alchemy.com/data/v1/${
        encodeURIComponent(alchemyApiKey.trim())
      }/assets/tokens/by-address`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      },
    );
    const responseText = await response.text();

    // Log data from response
    try {
      const parsed = JSON.parse(responseText);
      console.log(
        "Total tokens returned:",
        parsed?.data?.tokens?.length ?? "No tokens",
      );
      console.log();
      // console.log page key if any
      console.log("Page key:", parsed?.data?.pageKey ?? "No page key");

      // If there is page key, include in the fixture to test next call
      if (parsed?.data?.pageKey) {
        console.log("- TIP: Update the request fixture with 'pageKey' to test the next page's payload if needed. Defaults to 100 per page.");
      }
    } catch (e) {
      console.warn("Failed to parse response JSON for logging:", e);
    }

    // Ensure response successful
    assert(
      response.ok,
      `Expected 2xx response, got ${response.status}: ${responseText}`,
    );

    // Ensure payload matches response schema
    const payload = JSON.parse(responseText);
    const result = safeParse(TokensByAddressResponseSchema, payload);

    assert(result.success, JSON.stringify(result.issues, null, 2));
  },
});
