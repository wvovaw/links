import type { StatsPoint } from "~shared/api/backend";

/** The windows the screens offer. `30d` counts the day it is read on as its last one. */
export type StatsRangePreset = "7d" | "30d" | "all";

const dayMs = 86_400_000;
const presetDays = { "7d": 7, "30d": 30 } as const;

/**
 * The UTC day the API groups by. It is the same day the visitor hash rotates on, so the axis and the
 * numbers drawn on it agree about where a day starts — an owner in Moscow sees their evening visits on
 * tomorrow's bar, which the label says out loud.
 */
export function dayKey(at: Date): string {
  return at.toISOString().slice(0, 10);
}

/**
 * One point per day of the range the caller asked for, with the days no event touched as zeros.
 *
 * The API answers only the days it has rows for. A chart drawn straight from that would put two quiet
 * weeks next to each other and show a trend that never happened, so the gaps are filled here, where the
 * range the caller asked for is known.
 */
export function withEmptyDays(points: StatsPoint[], preset: StatsRangePreset, now: Date): StatsPoint[] {
  const known = new Map(points.map((point) => [point.date, point]));
  const days = preset === "all" ? spanOf(points) : spanBackFrom(now, presetDays[preset]);

  return days.map((date) => known.get(date) ?? { date, views: 0, visitors: 0, clicks: 0 });
}

/** The last `days` UTC days, ending with the one `now` falls in. */
function spanBackFrom(now: Date, days: number): string[] {
  const today = Date.parse(`${dayKey(now)}T00:00:00.000Z`);

  return Array.from({ length: days }, (_, index) => dayKey(new Date(today - (days - 1 - index) * dayMs)));
}

/** `all time` has no clock to count back from: the series' own first and last day bound it. */
function spanOf(points: StatsPoint[]): string[] {
  if (!points.length) return [];

  const times = points.map((point) => Date.parse(`${point.date}T00:00:00.000Z`));
  const first = Math.min(...times);

  return Array.from({ length: (Math.max(...times) - first) / dayMs + 1 }, (_, index) =>
    dayKey(new Date(first + index * dayMs)),
  );
}
