import type { StatsPoint, StatsTotals } from "~shared/api/backend";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import TotalsCards from "./totals-cards.vue";

/** 112 views against 100 is +12%; 12 clicks against 6 is +100%; visitors are flat. */
const totals: StatsTotals = { views: 112, visitors: 40, clicks: 12 };
const previous: StatsTotals = { views: 100, visitors: 40, clicks: 6 };
const points: StatsPoint[] = [{ date: "2026-11-17", views: 4, visitors: 2, clicks: 2 }];
const now = new Date("2026-11-17T12:00:00.000Z");

function cardOf(
  id: string,
  props: {
    totals: StatsTotals;
    previous?: StatsTotals | null;
    showCtr?: boolean;
    series?: { points: StatsPoint[]; preset: "7d" | "30d" | "all"; now: Date };
  },
) {
  return mount(TotalsCards, { props }).find(`[data-metric="${id}"]`);
}

describe("TotalsCards", () => {
  it("gives every metric a card, CTR included when the screen shows it", () => {
    const cards = mount(TotalsCards, { props: { totals, previous, showCtr: true } }).findAll("[data-metric]");

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

  /* The window's shape: one line per card, the range's quiet days included. */
  it("draws each metric over the range it was asked for", () => {
    const wrapper = mount(TotalsCards, { props: { totals, series: { points, preset: "7d", now } } });

    expect(wrapper.findAll("[data-spark]")).toHaveLength(3);
    expect(wrapper.find("[data-metric='clicks'] [data-spark]").attributes("data-points").split(" ")).toHaveLength(7);
  });

  /* No series, no line: a card drawn from a chart nobody asked for would show a shape that is not there. */
  it("draws no sparkline without a series", () => {
    expect(mount(TotalsCards, { props: { totals, previous } }).find("[data-spark]").exists()).toBe(false);
  });

  /* No previous period — an unbounded range, or the API's `null` — and no baseline to compare against. */
  it("prints no delta when there is no previous period", () => {
    for (const props of [
      { totals, showCtr: true },
      { totals, previous: null, showCtr: true },
    ]) {
      const wrapper = mount(TotalsCards, { props });

      expect(wrapper.findAll("[data-metric]")).toHaveLength(4);
      expect(wrapper.find("[data-delta]").exists()).toBe(false);
    }
  });
});
