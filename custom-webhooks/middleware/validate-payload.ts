import { createMiddleware } from "@hono/hono/factory";
import { parse } from "@valibot/valibot";
import {
  type AlchemyPayloadSchema as PayloadSchema,
  AlchemyPayloadSchema,
} from "../utils/schemas/index.ts";

export const validatePayload = createMiddleware<{
  Variables: { payload: PayloadSchema };
}>(async (ctx, next) => {
  const body = await ctx.req.json();

  const payload = parse(AlchemyPayloadSchema, body);
  ctx.set("payload", payload);

  await next();
});
