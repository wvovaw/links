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
  const { defineComponent, getCurrentInstance, h } = await import("vue");

  return {
    VisXYContainer: defineComponent({
      name: "VisXYContainer",
      props: {
        data: { type: Array, default: () => [] },
        height: { type: Number, default: 0 },
        /* Left undeclared in type on purpose: the real container treats "unset" differently from "false". */
        preventEmptyDomain: { default: undefined },
        padding: { default: undefined },
      },
      setup(props, { slots }) {
        const vm = getCurrentInstance();
        /*
          The keys the caller actually wrote, not the values they resolve to: the real container reads its
          own vnode props and copies each one over its default, so a key bound to `undefined` is not the same
          as a key never bound at all.
        */
        const named = () => Object.keys(vm?.vnode.props ?? {}).toSorted();

        return () =>
          h(
            "div",
            {
              "data-rows": String(props.data.length),
              "data-height": String(props.height),
              "data-flat": String(props.preventEmptyDomain),
              "data-padding": JSON.stringify(props.padding),
              "data-props": named().join(","),
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
    VisArea: defineComponent({
      name: "VisArea",
      props: { x: { type: Function, default: undefined }, y: { type: Function, default: undefined } },
      setup: () => () => h("i"),
    }),
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
    The library watches the accessor by reference: hand it the same function twice and it never redraws, so
    the line stays the old metric's shape while the toggle above it moves. Reading the metric inside the
    accessor instead of building the accessor from it is exactly how that happens — the computed then tracks
    nothing and caches its first function for the life of the component.
  */
  it("hands the library a new accessor every time the metric changes", async () => {
    const wrapper = mountChart({ compact: true });
    const yOf = () => wrapper.findComponent({ name: "VisLine" }).props("y") as (row: unknown) => number;
    const first = yOf();

    expect(first({ views: 1, visitors: 2, clicks: 3 })).toBe(1);

    await wrapper.setProps({ metric: "clicks" });

    expect(yOf()).not.toBe(first);
    expect(yOf()({ views: 1, visitors: 2, clicks: 3 })).toBe(3);
  });

  /*
    A card with nothing on any day still has to draw a line: a domain of one value collapses, and a sparkline
    that disappears reads as "the number above it is nothing", which is not the same fact. The line then sits
    on the floor, so the cards inset it — a stroke on the very edge loses half its width to the box.
  */
  it("keeps a flat line inside the box instead of an empty domain", () => {
    const compact = mountChart({ compact: true }).get("div[data-height]");

    expect(compact.attributes("data-flat")).toBe("true");
    expect(compact.attributes("data-padding")).toBe('{"top":2,"bottom":2}');

    /* Unset, never false: the library's own default already guards the big chart's empty axis, and its box
       keeps the edges it has always had. */
    const full = mountChart().get("div[data-height]");

    expect(full.attributes("data-flat")).toBe("undefined");
    expect(full.attributes("data-padding")).toBe(undefined);
  });

  /*
    The big chart's box holds the library's own padding, so the key must not be bound at all — binding it to
    `undefined` is worse than binding a wrong number, because the container copies it over the default and
    then reads `padding.left` off it. The same goes for the flag that guards a collapsed axis.
  */
  it("leaves the library's own defaults alone on the screen's chart", () => {
    const full = mountChart().get("div[data-height]");

    expect(full.attributes("data-props")).not.toContain("padding");
    expect(full.attributes("data-props")).not.toContain("preventEmptyDomain");
  });
});
