import type { StatsPoint } from "~shared/api/backend";

import { describe, expect, it } from "vitest";

import { withEmptyDays } from "./fill-days";

const now = new Date("2026-11-17T12:00:00.000Z");

function point(date: string, views: number, clicks = 0): StatsPoint {
  return { date, views, visitors: views, clicks };
}

describe("withEmptyDays", () => {
  /*
    The API answers only the days it has rows for. A chart drawn from that would collapse a quiet week into
    two neighbouring bars and tell the owner a trend that never happened.
  */
  it("fills the days a sparse series skipped", () => {
    const days = withEmptyDays([point("2026-11-15", 4), point("2026-11-17", 9)], "7d", now);

    expect(days).toHaveLength(7);
    expect(days.map((day) => day.date)).toEqual([
      "2026-11-11",
      "2026-11-12",
      "2026-11-13",
      "2026-11-14",
      "2026-11-15",
      "2026-11-16",
      "2026-11-17",
    ]);
    expect(days[4]).toEqual({ date: "2026-11-15", views: 4, visitors: 4, clicks: 0 });
    expect(days[5]).toEqual({ date: "2026-11-16", views: 0, visitors: 0, clicks: 0 });
    expect(days[6]?.views).toBe(9);
  });

  it("keeps every point of a dense series", () => {
    const dense = Array.from({ length: 30 }, (_, index) =>
      point(`2026-10-${String(index + 19).padStart(2, "0")}`, index),
    );

    expect(withEmptyDays(dense, "30d", now)).toHaveLength(30);
  });

  /* `all time` has no clock to count back from: the series' own first and last day bound it. */
  it("spans the series for the all-time range", () => {
    const days = withEmptyDays([point("2026-11-10", 2), point("2026-11-13", 1)], "all", now);

    expect(days.map((day) => day.date)).toEqual(["2026-11-10", "2026-11-11", "2026-11-12", "2026-11-13"]);
  });

  it("returns nothing for an empty series with the all-time range", () => {
    expect(withEmptyDays([], "all", now)).toEqual([]);
  });

  /* A page with no events still gets a full axis: seven bars of zero, not an empty chart. */
  it("fills a whole range for an empty series", () => {
    expect(withEmptyDays([], "7d", now)).toHaveLength(7);
  });
});
