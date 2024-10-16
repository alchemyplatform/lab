import type { InferOutput } from "@valibot/valibot";
import type { Payload } from "./schemas.ts";

export type Log = {
  // address: string;
  topics: string[];
  data: string;
  // blockNumber: string;
  // transactionHash: string;
  // transactionIndex: string;
  // blockHash: string;
  // logIndex: string;
  // removed: boolean;
};

export type Payload = InferOutput<typeof Payload>;
