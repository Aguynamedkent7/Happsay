/** A date as a local-calendar `YYYY-MM-DD` string. `toISOString()` is UTC and shifts the day. */
export function localDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parses a `YYYY-MM-DD` string as local midnight (the Date constructor would treat it as UTC). */
export function parseLocalDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Today's local date, shifted by `days`. */
export function localDateOffset(days: number): string {
  const now = new Date();
  return localDateString(new Date(now.getFullYear(), now.getMonth(), now.getDate() + days));
}
