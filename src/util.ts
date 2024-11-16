export function getRange(value: number, start: number, end?: number) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  return Math.min(Math.max(value, start), end);
}

export function getInt(n: number, digit = 2) {
  return parseFloat(n.toFixed(digit));
}

export const pipe =
  (...functions: Function[]) =>
  (initialValue: any) =>
    functions.reduce((acc, fn) => fn(acc), initialValue);
