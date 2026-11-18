import type { StatsPoint, StatsTotals } from "~shared/api/backend";

import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import TotalsCards from "./totals-cards.vue";

/** 112 views against 100 is +12%; 12 clicks against 6 is +100%; visitors are flat. */
const totals: StatsTotals = { views: 112, visitors: 40, clicks: 12 };
const previous: StatsTotals = { views: 100, visitors: 40, clicks: 6 };
const points: StatsPoint[] = [{ date: "2026-11-17", views: 4, visitors: 2, clicks: 2 }];
const now = new Date("2026-11-17T12:00:00.000Z");

/*
  The library draws in a box it measures, and happy-dom has no layout — so it stands in here. What the cards
  must get right is which series each one asks for.
*/
vi.mock("@unovis/vue", async () => {
  const { defineComponent, h } = await import("vue");

  return {
    VisXYContainer: defineComponent({
      name: "VisXYContainer",
      props: { data: { type: Array, default: () => [] } },
      setup(props, { slots }) {
        return () => h("div", { "data-inner-rows": String(props.data.length) }, slots.default?.());
      },
    }),
    VisLine: defineComponent({ name: "VisLine", setup: () => () => h("i") }),
    VisArea: defineComponent({ name: "VisArea", setup: () => () => h("i") }),
    VisAxis: defineComponent({ name: "VisAxis", setup: () => () => h("i") }),
    VisCrosshair: defineComponent({ name: "VisCrosshair", setup: () => () => h("i") }),
    VisTooltip: defineComponent({ name: "VisTooltip", setup: () => () => h("i") }),
  };
});

const stubs = { ClientOnly: { template: "<div><slot /></div>" } };

type Props = {
  totals: StatsTotals;
  previous?: StatsTotals | null;
  showCtr?: boolean;
  series?: { points: StatsPoint[]; preset: "7d" | "30d" | "all"; now: Date };
};

function cardOf(id: string, props: Props) {
  return mount(TotalsCards, { props, global: { stubs } }).find(`[data-metric="${id}"]`);
}

describe("TotalsCards", () => {
  it("gives every metric a card, CTR included when the screen shows it", () => {
    const cards = mount(TotalsCards, { props: { totals, previous, showCtr: true }, global: { stubs } }).findAll(
      "[data-metric]",
    );

    expect(cards.map((card) => card.attributes("data-metric"))).toEqual(["clicks", "visitors", "ctr", "views"]);
  });

  it("prints a count's change against the previous period", () => {
    expect(cardOf("views", { totals, previous }).text()).toContain("+12%");
    expect(cardOf("clicks", { totals, previous }).text()).toContain("+100%");
  });

  /* A percentage read against a percentage is points, not a ratio: 10.7% over 6% is +5 points, not +79%. */
  it("prints CTR's change in percentage points", () => {
    const ctr = cardOf("ctr", { totals, previous, showCtr: true }).text();

    expect(ctr).toContain("+5%");
    expect(ctr).not.toContain("+79%");
  });

  /* Nothing moved: the chip says so with a level arrow, never an up or down one. */
  it("marks an unchanged metric flat instead of an arrow", () => {
    const visitors = cardOf("visitors", { totals, previous }).text();

    expect(visitors).toContain("0%");
    expect(visitors).toContain("→");
    expect(visitors).not.toContain("↑");
    expect(visitors).not.toContain("↓");
  });

  /* Each card draws its own metric over the same days: one range, four shapes. */
  it("draws every card over the days of the range it was asked for", () => {
    const charts = mount(TotalsCards, {
      props: { totals, series: { points, preset: "7d", now } },
      global: { stubs },
    }).findAll("[data-chart]");

    expect(charts).toHaveLength(3);
    expect(charts.map((chart) => chart.attributes("data-metric"))).toEqual(["clicks", "visitors", "views"]);
    expect(charts.map((chart) => chart.attributes("data-rows"))).toEqual(["7", "7", "7"]);
  });

  /* No series, no line: a card drawn from a chart nobody asked for would show a shape that is not there. */
  it("draws no sparkline without a series", () => {
    expect(mount(TotalsCards, { props: { totals, previous }, global: { stubs } }).find("[data-chart]").exists()).toBe(
      false,
    );
  });

  /* No previous period — an unbounded range, or the API's `null` — and no baseline to compare against. */
  it("prints no delta when there is no previous period", () => {
    for (const props of [
      { totals, showCtr: true },
      { totals, previous: null, showCtr: true },
    ]) {
      const wrapper = mount(TotalsCards, { props, global: { stubs } });

      expect(wrapper.findAll("[data-metric]")).toHaveLength(4);
      expect(wrapper.find("[data-delta]").exists()).toBe(false);
    }
  });
});
