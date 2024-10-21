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
      console.error(errMessage);
      return ctx.json({ error: errMessage }, { status: 400 });
    }

    if (e instanceof ValiError) {
      const errMessage = `Error validating payload: ${e.message}`;
      console.error(errMessage);
      const issuePath = e.issues.map((i: any) =>
        i.path.map((path: { key: string }) => path.key).join(".")
      );
      return ctx.json(
        { error: errMessage, issues: issuePath },
        { status: 400 }
      );
    }

    return ctx.json(
      { error: "Unknown error validating payload" },
      { status: 400 }
    );
  }
});
