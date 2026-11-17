import type { StatsSource } from "~shared/api/backend";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import SourcesTable from "./sources-table.vue";

const ranked: StatsSource[] = [
  { source: "t.me", medium: "social", views: 6, visitors: 5, clicks: 2 },
  { source: "google.com", medium: "search", views: 3, visitors: 3, clicks: 0 },
  { source: "direct", medium: "direct", views: 1, visitors: 1, clicks: 1 },
];

describe("SourcesTable", () => {
  /* The API ranks by views; the table must not re-sort and disagree with the numbers beside it. */
  it("keeps the order the API ranked", () => {
    const rows = mount(SourcesTable, { props: { sources: ranked } }).findAll("[data-source]");

    expect(rows.map((row) => row.attributes("data-source"))).toEqual(["t.me", "google.com", "direct"]);
  });

  it("prints each source's views and its share of the range", () => {
    const wrapper = mount(SourcesTable, { props: { sources: ranked } });

    expect(wrapper.text()).toContain("6");
    expect(wrapper.text()).toContain("60%");
    expect(wrapper.text()).toContain("10%");
  });

  /* The medium is what the owner reads a source by, and an unknown utm medium falls back to its own word. */
  it("labels every row with its medium", () => {
    const rows = mount(SourcesTable, { props: { sources: ranked } }).findAll("[data-source]");

    expect(rows.map((row) => row.attributes("data-medium"))).toEqual(["social", "search", "direct"]);
  });

  it("shows an empty-state line instead of a table when there is nothing", () => {
    const wrapper = mount(SourcesTable, { props: { sources: [] } });

    expect(wrapper.find("[data-testid='sources-empty']").exists()).toBe(true);
    expect(wrapper.findAll("tbody tr")).toHaveLength(0);
  });
});
