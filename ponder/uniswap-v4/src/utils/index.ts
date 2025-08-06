import Decimal from "decimal.js"

export function exponentToBigDecimal(decimals: bigint): Decimal {
  let resultString = '1'

  for (let i = 0; i < Number(decimals); i++) {
    resultString += '0'
  }

  return new Decimal(resultString);
}