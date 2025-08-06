import Decimal from "decimal.js"

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