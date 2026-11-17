import type { StatsPoint } from "~shared/api/backend";

import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import VisitsChart from "./visits-chart.vue";

const now = new Date("2026-11-17T12:00:00.000Z");

/** Two days of traffic out of the seven the chart is asked to draw. */
const sparse: StatsPoint[] = [
  { date: "2026-11-15", views: 4, visitors: 3, clicks: 1 },
  { date: "2026-11-17", views: 9, visitors: 7, clicks: 2 },
];

/*
  The drawing is the library's business and it is measured in a browser, not here — happy-dom has no layout.
  What this card must get right is what it hands over: every day of the range, zeros included, counted.
*/
vi.mock("@unovis/vue", async () => {
  const { defineComponent, h } = await import("vue");

  return {
    VisXYContainer: defineComponent({
      name: "VisXYContainer",
      props: { data: { type: Array, default: () => [] } },
      setup(props, { slots }) {
        return () =>
          h(
            "div",
            {
              "data-chart": "",
              "data-rows": String(props.data.length),
              "data-series": props.data.map((row) => `${row.date}:${row.views}`).join(","),
            },
            slots.default?.(),
          );
      },
    }),
    VisStackedBar: defineComponent({ setup: () => () => h("i") }),
    VisAxis: defineComponent({ setup: () => () => h("i") }),
    VisTooltip: defineComponent({
      name: "VisTooltip",
      props: { triggers: { type: Object, default: () => ({}) } },
      setup: () => () => h("i"),
    }),
    VisStackedBarSelectors: { bar: ".vis-stacked-bar .bar", barGroup: ".vis-stacked-bar .bar-group" },
  };
});

const stubs = { ClientOnly: { template: "<div><slot /></div>" } };

function chartOf(points: StatsPoint[], preset: "7d" | "30d" = "7d") {
  return mount(VisitsChart, { props: { points, preset, now }, global: { stubs } }).find("[data-chart]");
}

describe("VisitsChart", () => {
  it("hands the chart one bar per day of the range", () => {
    expect(chartOf(sparse).attributes("data-rows")).toBe("7");
  });

  /* The quiet days are real zeros: a chart that skips them turns three visits into a solid block. */
  it("fills the quiet days with zeros and keeps every UTC date", () => {
    expect(chartOf(sparse).attributes("data-series")).toBe(
      "2026-11-11:0,2026-11-12:0,2026-11-13:0,2026-11-14:0,2026-11-15:4,2026-11-16:0,2026-11-17:9",
    );
  });

  /* Hovering a bar is the only place the exact daily numbers live, so the trigger has to carry both. */
  it("describes a bar with its date and its count", () => {
    const tooltip = mount(VisitsChart, { props: { points: sparse, preset: "7d", now }, global: { stubs } })
      .findComponent({ name: "VisTooltip" })
      .props("triggers");
    const describeBar = Object.values(tooltip as Record<string, (row: unknown) => string>)[0];

    expect(Object.keys(tooltip as object)).toEqual([".vis-stacked-bar .bar-group"]);
    expect(describeBar?.({ index: 6, date: "2026-11-17", label: "17.11", views: 9, visitors: 7, clicks: 2 })).toBe(
      "2026-11-17 — 9",
    );
  });

  /* An empty page still gets an axis, so the screen reads "nothing yet" rather than a chart with no days. */
  it("draws a flat range for a page with no visits", () => {
    expect(chartOf([], "30d").attributes("data-rows")).toBe("30");
  });
});
