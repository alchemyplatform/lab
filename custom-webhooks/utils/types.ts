import type { InferOutput } from "@valibot/valibot";
import type { Log } from "./schemas.ts";

export type Log = InferOutput<typeof Log>;
