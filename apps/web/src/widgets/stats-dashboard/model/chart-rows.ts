import type { StatsDay } from "./fill-days";

/** One bar's datum. The chart plots numbers, so the date travels beside the number, not as the number. */
export interface ChartRow extends StatsDay {
  index: number;
  /** The short form drawn under the axis: `17.11` reads the same in both locales, unlike a formatted month. */
  label: string;
}

export function chartRows(days: StatsDay[]): ChartRow[] {
  return days.map((day, index) => ({
    ...day,
    index,
    label: day.date.slice(8, 10) + "." + day.date.slice(5, 7),
  }));
}

/** The three series the owner can draw. One chart, one of them at a time. */
export type ChartMetric = "views" | "visitors" | "clicks";

/** What hovering a point says: the full UTC date and the day's own count of the drawn metric. */
export function describeDay(row: ChartRow, metric: ChartMetric): string {
  return `${row.date} — ${row[metric]}`;
}

/**
 * Which days get a label under the axis. A week labels every day; a month would be a wall of overlapping
 * dates, so it keeps a handful, evenly spaced and always including the last one — the owner reads "today"
 * off the right edge.
 */
export function tickIndexes(count: number, maxTicks = 7): number[] {
  if (count <= maxTicks) return Array.from({ length: count }, (_, index) => index);

  const step = Math.ceil((count - 1) / (maxTicks - 1));
  const ticks: number[] = [];
  for (let index = 0; index < count; index += step) ticks.push(index);
  if (ticks.at(-1) !== count - 1) ticks.push(count - 1);

  return ticks;
}
