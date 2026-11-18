import type { StatsPoint } from "~shared/api/backend";

import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import TrafficChart from "./traffic-chart.vue";

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
              "data-rows": String(props.data.length),
              "data-series": props.data
                .map((row) => `${row.date}:${row.views}/${row.visitors}/${row.clicks}`)
                .join(","),
            },
            slots.default?.(),
          );
      },
    }),
    VisArea: defineComponent({ setup: () => () => h("i") }),
    VisAxis: defineComponent({ setup: () => () => h("i") }),
    VisCrosshair: defineComponent({
      name: "VisCrosshair",
      props: { template: { type: Function, default: undefined } },
      setup: () => () => h("i"),
    }),
    VisTooltip: defineComponent({ setup: () => () => h("i") }),
  };
});

const stubs = { ClientOnly: { template: "<div><slot /></div>" } };

function mountChart(points: StatsPoint[], preset: "7d" | "30d" | "all" = "7d") {
  return mount(TrafficChart, { props: { points, preset, now }, global: { stubs } });
}

function chartOf(points: StatsPoint[], preset: "7d" | "30d" | "all" = "7d") {
  return mountChart(points, preset).find("[data-chart]");
}

describe("TrafficChart", () => {
  it("hands the chart one point per day of the range", () => {
    expect(chartOf(sparse).attributes("data-rows")).toBe("7");
    expect(chartOf([], "30d").attributes("data-rows")).toBe("30");
  });

  /* `all time` has no clock to count back from: the series' own first and last day bound the area. */
  it("draws every day between the first and the last of an unbounded range", () => {
    expect(chartOf(sparse, "all").attributes("data-rows")).toBe("3");
  });

  /* The quiet days are real zeros: an area that skips them turns three visits into a solid block. */
  it("fills the quiet days with zeros and keeps every UTC date", () => {
    expect(chartOf(sparse).find("[data-series]").attributes("data-series")).toBe(
      "2026-11-11:0/0/0,2026-11-12:0/0/0,2026-11-13:0/0/0,2026-11-14:0/0/0,2026-11-15:4/3/1,2026-11-16:0/0/0,2026-11-17:9/7/2",
    );
  });

  it("opens on visits and switches the drawn series to the metric the owner picks", async () => {
    const wrapper = mountChart(sparse);

    expect(wrapper.get("[data-chart]").attributes("data-metric")).toBe("views");

    await wrapper.get("[data-toggle='clicks']").trigger("click");

    expect(wrapper.get("[data-chart]").attributes("data-metric")).toBe("clicks");
  });

  /* Hovering a point is the only place the exact daily numbers live, so the tooltip has to name the metric. */
  it("describes a point with its date and the chosen metric's count", async () => {
    const wrapper = mountChart(sparse);
    const describePoint = () =>
      wrapper.findComponent({ name: "VisCrosshair" }).props("template") as (row: unknown) => string;
    const row = { date: "2026-11-17", views: 9, visitors: 7, clicks: 2 };

    expect(describePoint()(row)).toBe("2026-11-17 — 9");

    await wrapper.get("[data-toggle='visitors']").trigger("click");

    expect(describePoint()(row)).toBe("2026-11-17 — 7");
  });

  /* An empty page still gets an axis, so the screen reads "nothing yet" rather than a chart with no days. */
  it("draws a flat range for a page with no visits", () => {
    expect(chartOf([]).attributes("data-rows")).toBe("7");
  });
});
