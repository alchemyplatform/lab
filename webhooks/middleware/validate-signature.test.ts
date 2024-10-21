// deno test --allow-net --allow-env --env

import { describe } from "node:test";
import { app } from "../index.ts";
import test from "node:test";

describe("Example", () => {
  test("GET /posts", async () => {
    const res = await app.request("/");
  });
});
