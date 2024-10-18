import { createMiddleware } from "@hono/hono/factory";
import { parse, ValiError } from "@valibot/valibot";
import {
  type AlchemyPayload,
  AlchemyPayloadSchema,
} from "../utils/schemas/index.ts";

export const validatePayload = createMiddleware<{
  Variables: { payload: AlchemyPayload };
}>(async (ctx, next) => {
  const body = await ctx.req.json();

  try {
    const payload = parse(AlchemyPayloadSchema, body);
    ctx.set("payload", payload);
    await next();
  } catch (e) {
    if (e instanceof ValiError) {
      console.log(
        e.issues.map((i) => i.path.map((path) => path.key).join("."))
      );
    }
    console.log(JSON.stringify(body.event.data.block.logs, null, 2));
    console.log(JSON.stringify(body.event.data.block.number, null, 2));
  }
});
