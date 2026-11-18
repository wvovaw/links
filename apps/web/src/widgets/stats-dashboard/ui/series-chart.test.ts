import type { StatsPoint } from "~shared/api/backend";

import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import SeriesChart from "./series-chart.vue";

const now = new Date("2026-11-17T12:00:00.000Z");

/** Two days of traffic out of the seven the chart is asked to draw. */
const sparse: StatsPoint[] = [
  { date: "2026-11-16", views: 4, visitors: 3, clicks: 1 },
  { date: "2026-11-17", views: 8, visitors: 7, clicks: 4 },
];

/*
  The drawing is the library's business and it is measured in a browser, not here — happy-dom has no layout.
  What this component must get right is the data it hands over, which parts it asks the library for, and how
  big a box it gives them.
*/
vi.mock("@unovis/vue", async () => {
  const { defineComponent, h } = await import("vue");

  return {
    VisXYContainer: defineComponent({
      name: "VisXYContainer",
      props: {
        data: { type: Array, default: () => [] },
        height: { type: Number, default: 0 },
        /* Left undeclared in type on purpose: the real container treats "unset" differently from "false". */
        preventEmptyDomain: { default: undefined },
      },
      setup(props, { slots }) {
        return () =>
          h(
            "div",
            {
              "data-rows": String(props.data.length),
              "data-height": String(props.height),
              "data-flat": String(props.preventEmptyDomain),
            },
            slots.default?.(),
          );
      },
    }),
    VisLine: defineComponent({
      name: "VisLine",
      props: { x: { type: Function, default: undefined }, y: { type: Function, default: undefined } },
      setup: () => () => h("i"),
    }),
    VisArea: defineComponent({ name: "VisArea", setup: () => () => h("i") }),
    VisAxis: defineComponent({ name: "VisAxis", setup: () => () => h("i") }),
    VisCrosshair: defineComponent({ name: "VisCrosshair", setup: () => () => h("i") }),
    VisTooltip: defineComponent({ name: "VisTooltip", setup: () => () => h("i") }),
  };
});

const stubs = { ClientOnly: { template: "<div><slot /></div>" } };

function mountChart(
  props: Partial<{ points: StatsPoint[]; preset: "7d" | "30d" | "all"; metric: string; compact: boolean }> = {},
) {
  return mount(SeriesChart, {
    props: { points: sparse, preset: "7d", now, metric: "views", ...props },
    global: { stubs },
  });
}

describe("SeriesChart", () => {
  it("hands the library one point per day of the range", () => {
    expect(mountChart().get("[data-chart]").attributes("data-rows")).toBe("7");
    expect(mountChart({ points: [], preset: "30d" }).get("[data-chart]").attributes("data-rows")).toBe("30");
  });

  /* A card is a shape, not a chart: no axis to read, nothing to hover, and a box the size of a line. */
  it("draws a card's line without an axis, a fill or a tooltip", () => {
    const wrapper = mountChart({ compact: true });

    expect(wrapper.findComponent({ name: "VisLine" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "VisArea" }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: "VisAxis" }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: "VisCrosshair" }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: "VisTooltip" }).exists()).toBe(false);
    expect(wrapper.get("div[data-height]").attributes("data-height")).toBe("24");
  });

  it("draws the screen's chart with an area, an axis and a crosshair", () => {
    const wrapper = mountChart();

    expect(wrapper.findComponent({ name: "VisArea" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "VisAxis" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "VisCrosshair" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "VisTooltip" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "VisLine" }).exists()).toBe(false);
    expect(wrapper.get("div[data-height]").attributes("data-height")).toBe("128");
  });

  /* CTR is a card's metric: the line reads the day's own rate, not a count. */
  it("plots the metric it was asked for, CTR included", () => {
    const yOf = (metric: string) =>
      mountChart({ compact: true, metric }).findComponent({ name: "VisLine" }).props("y") as (row: unknown) => number;
    const row = { views: 8, visitors: 7, clicks: 4, ctr: 0.5 };

    expect(yOf("clicks")(row)).toBe(4);
    expect(yOf("ctr")(row)).toBe(0.5);
  });

  /*
    A card with nothing on any day still has to draw a line: a domain of one value collapses, and a sparkline
    that disappears reads as "the number above it is nothing", which is not the same fact.
  */
  it("keeps a flat line on the floor instead of an empty domain", () => {
    expect(mountChart({ compact: true }).get("div[data-height]").attributes("data-flat")).toBe("true");
    /* Unset, never false: the library's own default already guards the big chart's empty axis. */
    expect(mountChart().get("div[data-height]").attributes("data-flat")).toBe("undefined");
  });
});
