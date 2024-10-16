import { createMiddleware } from "@hono/hono/factory";
// import { parse } from "npm:graphql";
import { Payload as PayloadSchema } from "../../utils/schemas.ts";
import { parse } from "@valibot/valibot";
import type { Payload } from "../../utils/types.ts";

type ValidatePayloadOptions = {
  graphQlQuery?: string;
};

export const validatePayload = (options: ValidatePayloadOptions = {}) => {
  // 1. validate if GraphQL schema

  // 2. validate if fields are valid fields (i.e. supported by Alchemy webhooks)

  // 3. return typed payload

  //   const res =
  //     parse(`# ALL FIELDS THAT CAN BE RETURNED BY ALCHEMY CUSTOM WEBHOOKS
  // {
  //   block {
  //     hash,
  //     number,
  //     timestamp,
  //     logs(filter: {addresses: [], topics: []}) {
  //       data,
  //       topics,
  //       index,
  //       account {
  //         address
  //       },
  //       transaction {
  //         hash,
  //         nonce,
  //         index,
  //         from {
  //           address
  //         },
  //         to {
  //           address
  //         },
  //         value,
  //         gasPrice,
  //         maxFeePerGas,
  //         maxPriorityFeePerGas,
  //         gas,
  //         status,
  //         gasUsed,
  //         cumulativeGasUsed,
  //         effectiveGasPrice,
  //         createdContract {
  //           address
  //         }
  //       }
  //     }
  //   }
  // }
  // `);
  // console.log(res);

  return createMiddleware<{ Variables: { payload: Payload } }>(
    async (ctx, next) => {
      const body = await ctx.req.json();

      const payload = parse(PayloadSchema, body);
      ctx.set("payload", payload);

      await next();
    }
  );
};
