import { createMiddleware } from "@hono/hono/factory";
import { parse } from "@valibot/valibot";
import {
  type AlchemyPayload,
  AlchemyPayloadSchema,
} from "../utils/schemas/index.ts";

export const validatePayload = createMiddleware<{
  Variables: { payload: AlchemyPayload };
}>(async (ctx, next) => {
  const body = await ctx.req.json();

  const payload = parse(AlchemyPayloadSchema, body);
  ctx.set("payload", payload);

  await next();
});
