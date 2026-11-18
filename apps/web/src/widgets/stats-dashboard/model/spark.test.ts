import type { StatsPoint } from "~shared/api/backend";

import { describe, expect, it } from "vitest";

import { metricSpark } from "./spark";

const now = new Date("2026-11-17T12:00:00.000Z");
const points: StatsPoint[] = [{ date: "2026-11-17", views: 4, visitors: 2, clicks: 2 }];

describe("metricSpark", () => {
  it("gives one number per day of the range, quiet days at zero", () => {
    expect(metricSpark(points, "clicks", "7d", now)).toEqual([0, 0, 0, 0, 0, 0, 2]);
    expect(metricSpark(points, "visitors", "30d", now)).toHaveLength(30);
  });

  /* CTR has no series of its own: the day's rate is that day's clicks over its views. */
  it("derives CTR per day", () => {
    expect(metricSpark(points, "ctr", "7d", now).at(-1)).toBe(0.5);
  });

  /* A day nobody visited has no rate; a line drawn from a division by zero is a lie, not a spike. */
  it("has no CTR to divide by zero on a quiet range", () => {
    expect(metricSpark([], "ctr", "7d", now)).toEqual(Array.from({ length: 7 }, () => 0));
  });
});
