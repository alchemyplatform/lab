import Decimal from "decimal.js"
import { Context, Event } from "ponder:registry";
import { transactions } from "ponder:schema";

export function exponentToBigDecimal(decimals: bigint): Decimal {
  let resultString = '1'

  for (let i = 0; i < Number(decimals); i++) {
    resultString += '0'
  }

  return new Decimal(resultString);
}

export function convertTokenToDecimal(tokenAmount: bigint, exchangeDecimals: bigint): Decimal {
  if (exchangeDecimals == 0n) {
    return new Decimal(tokenAmount);
  }
  return new Decimal(tokenAmount).div(exponentToBigDecimal(exchangeDecimals));
}

export async function loadTransaction(context: Context, event: Event) {
  let transaction = await context.db.find(transactions, { id: event.transaction.hash });

  if (transaction === null) {
    transaction = await context.db.insert(transactions).values({
      id: event.transaction.hash,
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
      // TODO: needs to be moved to transaction receipt
      // What does this mean?
      gasUsed: 0n,
      gasPrice: event.transaction.gasPrice ?? 0n,
    });
  }
  return transaction;
}