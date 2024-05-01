export function formatNumberWithCommas(number: number) {
  const numStr = number.toString();
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getDecimalPlaces(amt: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  const truncated = Math.trunc(amt * factor) / factor;
  return truncated;
}

export function getDecimalPlacesWithoutRounding(
  amt: number,
  decimalPlaces: number
): string {
  const factor = Math.pow(10, decimalPlaces);
  const truncated = Math.trunc(amt * factor) / factor;
  return truncated.toLocaleString("en-US", {
    minimumFractionDigits: 0, // 最少的小数位数
    maximumFractionDigits: decimalPlaces, // 最多的小数位数
  });
}

export function formatToken(
  value?: number,
  decimals: number = 12,
  length: number = 4
): string {
  if (value === undefined) {
    return "~";
  }

  return getDecimalPlacesWithoutRounding(
    value / Math.pow(10, decimals),
    length
  ).toString();
}

export function shotAddress(address: string) {
  return address.slice(0, 6) + "..." + address.slice(-6);
}
