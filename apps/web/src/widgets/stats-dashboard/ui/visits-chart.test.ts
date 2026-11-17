import type { StatsPoint } from "~shared/api/backend";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import VisitsChart from "./visits-chart.vue";

const now = new Date("2026-11-17T12:00:00.000Z");

/** Two days of traffic out of the seven the chart is asked to draw. */
const sparse: StatsPoint[] = [
  { date: "2026-11-15", views: 4, visitors: 3, clicks: 1 },
  { date: "2026-11-17", views: 9, visitors: 7, clicks: 2 },
];

describe("VisitsChart", () => {
  it("draws one bar per day of the range", () => {
    const wrapper = mount(VisitsChart, { props: { points: sparse, preset: "7d", now } });

    expect(wrapper.findAll("rect")).toHaveLength(7);
  });

  /* Read back as attributes, never as pixels: the axis is the UTC day, and the quiet days are zeros. */
  it("labels every bar with its UTC date and its own count", () => {
    const bars = mount(VisitsChart, { props: { points: sparse, preset: "7d", now } }).findAll("rect");

    expect(bars[0]?.attributes("data-date")).toBe("2026-11-11");
    expect(bars[5]?.attributes("data-date")).toBe("2026-11-16");
    expect(bars[5]?.attributes("data-views")).toBe("0");
    expect(bars[6]?.attributes("data-views")).toBe("9");
  });

  /* A bar's height is relative; hovering it has to say which day it is and how many visits it holds. */
  it("names every bar with its date and its count", () => {
    const bars = mount(VisitsChart, { props: { points: sparse, preset: "7d", now } }).findAll("rect");

    expect(bars[6]?.find("title").text()).toBe("2026-11-17 — 9");
    expect(bars[5]?.find("title").text()).toBe("2026-11-16 — 0");
  });

  /* An empty page still gets an axis, so the screen reads "nothing yet" rather than a chart with no days. */
  it("draws a flat range for a page with no visits", () => {
    const wrapper = mount(VisitsChart, { props: { points: [], preset: "30d", now } });

    expect(wrapper.findAll("rect")).toHaveLength(30);
    expect(wrapper.findAll("rect").every((bar) => bar.attributes("data-views") === "0")).toBe(true);
  });
});
