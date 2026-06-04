export function getRange(value: number, start: number, end?: number) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  return Math.min(Math.max(value, start), end);
}

export function roundTo(n: number, digit = 2) {
  return parseFloat(n.toFixed(digit));
}
