import { describe, expect, it } from "vitest";

import { chartRows, describeDay, tickIndexes } from "./chart-rows";

describe("chartRows", () => {
  /* The chart plots numbers; the date rides beside them so a tooltip can say which day a bar is. */
  it("numbers the days and keeps their dates", () => {
    const rows = chartRows([
      { date: "2026-11-16", views: 0, visitors: 0, clicks: 0 },
      { date: "2026-11-17", views: 9, visitors: 7, clicks: 2 },
    ]);

    expect(rows).toEqual([
      { index: 0, date: "2026-11-16", label: "16.11", views: 0, visitors: 0, clicks: 0, ctr: 0 },
      { index: 1, date: "2026-11-17", label: "17.11", views: 9, visitors: 7, clicks: 2, ctr: 2 / 9 },
    ]);
  });

  /*
    CTR has no series of its own: the card that draws it reads the day's own rate, and a day nobody visited
    has none to draw. The period's average rate would draw a line the reader cannot explain.
  */
  it("carries each day's own CTR, and no rate for a day with no views", () => {
    const rows = chartRows([
      { date: "2026-11-16", views: 0, visitors: 0, clicks: 3 },
      { date: "2026-11-17", views: 4, visitors: 2, clicks: 1 },
    ]);

    expect(rows[0]?.ctr).toBe(0);
    expect(rows[1]?.ctr).toBe(0.25);
  });
});

describe("describeDay", () => {
  const row = { index: 1, date: "2026-11-17", label: "17.11", views: 9, visitors: 7, clicks: 2, ctr: 2 / 9 };

  it("says the day and the count of the metric the chart draws", () => {
    expect(describeDay(row, "clicks")).toBe("2026-11-17 — 2");
  });

  it("reads the chosen metric, not the views", () => {
    expect(describeDay(row, "views")).toBe("2026-11-17 — 9");
    expect(describeDay(row, "visitors")).toBe("2026-11-17 — 7");
  });
});

describe("tickIndexes", () => {
  it("labels every day of a week", () => {
    expect(tickIndexes(7)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  /* Thirty dates under one bar chart are a wall, so a month keeps a handful of them, ends included. */
  it("thins a month out to a handful of evenly spaced days", () => {
    const ticks = tickIndexes(30);

    expect(ticks).toHaveLength(7);
    expect(ticks[0]).toBe(0);
    expect(ticks.at(-1)).toBe(29);
  });

  it("keeps the ends when the length does not divide evenly", () => {
    const ticks = tickIndexes(11);

    expect(ticks[0]).toBe(0);
    expect(ticks.at(-1)).toBe(10);
    expect(ticks.length).toBeLessThanOrEqual(7);
  });

  it("has nothing to label for an empty range", () => {
    expect(tickIndexes(0)).toEqual([]);
  });
});
