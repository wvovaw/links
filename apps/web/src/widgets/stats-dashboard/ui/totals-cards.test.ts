import type { StatsTotals } from "~shared/api/backend";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import TotalsCards from "./totals-cards.vue";

/** 112 views against 100 is +12%; 12 clicks against 6 is +100%; visitors are flat. */
const totals: StatsTotals = { views: 112, visitors: 40, clicks: 12 };
const previous: StatsTotals = { views: 100, visitors: 40, clicks: 6 };

function cardOf(id: string, props: { totals: StatsTotals; previous?: StatsTotals | null; showCtr?: boolean }) {
  return mount(TotalsCards, { props }).find(`[data-metric="${id}"]`);
}

describe("TotalsCards", () => {
  it("gives every metric a card, CTR included when the screen shows it", () => {
    const cards = mount(TotalsCards, { props: { totals, previous, showCtr: true } }).findAll("[data-metric]");

    expect(cards.map((card) => card.attributes("data-metric"))).toEqual(["views", "visitors", "clicks", "ctr"]);
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
