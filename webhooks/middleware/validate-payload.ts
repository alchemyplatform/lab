import { createMiddleware } from "@hono/hono/factory";
import { parse, ValiError } from "@valibot/valibot";
import {
  type AlchemyPayload,
  AlchemyPayloadSchema,
} from "../utils/schemas/index.ts";

export const validatePayload = createMiddleware<{
  Variables: { payload: AlchemyPayload };
}>(async (ctx, next) => {
  try {
    const body = await ctx.req.json();
    const payload = parse(AlchemyPayloadSchema, body);
    ctx.set("payload", payload);
    await next();
  } catch (e) {
    if (e instanceof SyntaxError) {
      const errMessage = `Error parsing payload: ${e.message}`;
      return ctx.json({ error: errMessage }, { status: 400 });
    }

    if (e instanceof ValiError) {
      console.log(e.message);
      const errMessage = `Error validating payload: ${e.message}`;
      const issuePath = e.issues.map((i) =>
        i.path.map((path) => path.key).join(".")
      );
      return ctx.json(
        { error: errMessage, issues: issuePath },
        { status: 400 }
      );
    }

    return ctx.json(
      { error: "Error in validatePayload middleware" },
      { status: 400 }
    );
  }
});
