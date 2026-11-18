import type { StatsPoint } from "~shared/api/backend";

import type { ChartMetric } from "./chart-rows";

import { type StatsRangePreset, withEmptyDays } from "./fill-days";

/** The numbers a card can draw: the three the chart plots, and CTR, which has no series of its own. */
export type SparkMetric = ChartMetric | "ctr";

/**
 * One number per day of the range, its quiet days included, for a card's sparkline. A day's CTR is derived
 * from that day's own clicks and views — the period's average rate would draw a line the reader cannot
 * explain, and a day with no views has no rate to draw.
 */
export function metricSpark(points: StatsPoint[], metric: SparkMetric, preset: StatsRangePreset, now: Date): number[] {
  return withEmptyDays(points, preset, now).map((day) =>
    metric === "ctr" ? (day.views ? day.clicks / day.views : 0) : day[metric],
  );
}
