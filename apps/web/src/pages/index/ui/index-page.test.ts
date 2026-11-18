import type { OverviewStats } from "~shared/api/backend";

import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getOverview: vi.fn() }));

vi.mock("~shared/api/backend", () => ({ AnalyticsApi: { getOverview: mocks.getOverview } }));

import IndexPage from "./index-page.vue";

const overview: OverviewStats = {
  totals: { views: 1284, visitors: 913, clicks: 247 },
  timeseries: [{ date: "2026-11-17", views: 42, visitors: 31, clicks: 9 }],
  sources: [{ source: "t.me", medium: "social", views: 305, visitors: 244, clicks: 70 }],
  links: [
    { id: "l1", slug: "my-page", title: "My page", views: 913, visitors: 620, clicks: 187 },
    { id: "l2", slug: "blog", title: "Blog", views: 371, visitors: 240, clicks: 60 },
  ],
};

/** The locale-aware link is a route in the app and a stub here: the test reads the target, not the markup. */
const stubs = {
  NuxtLinkLocale: {
    props: { to: { type: [String, Object], required: true } },
    template: `<a :data-to="JSON.stringify(to)"><slot /></a>`,
  },
};

function mountPage() {
  return mount(IndexPage, { global: { stubs } });
}

describe("IndexPage", () => {
  beforeEach(() => {
    mocks.getOverview.mockReset();
  });

  it("shows the totals the API returned", async () => {
    mocks.getOverview.mockResolvedValue({ stats: overview, failed: false });

    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.get("[data-metric='views'] dd").text()).toBe("1284");
    expect(wrapper.get("[data-metric='visitors'] dd").text()).toBe("913");
    expect(wrapper.get("[data-metric='clicks'] dd").text()).toBe("247");
  });

  /* "Nothing yet" and "we could not ask" are different facts, and zeros would tell the wrong one. */
  it("shows the failed state instead of zeros", async () => {
    mocks.getOverview.mockResolvedValue({ stats: null, failed: true });

    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.find("[data-testid='stats-failed']").exists()).toBe(true);
    expect(wrapper.find("[data-metric='views']").exists()).toBe(false);
  });

  /* Every card draws its own metric over the range's days, with the same chart the screen below it draws. */
  it("draws each card's line over the range's days", async () => {
    mocks.getOverview.mockResolvedValue({ stats: overview, failed: false });

    const wrapper = mountPage();
    await flushPromises();

    const charts = wrapper.findAll("[data-metric] [data-chart]");

    expect(charts.map((chart) => chart.attributes("data-metric"))).toEqual(["clicks", "visitors", "views"]);
    expect(charts.map((chart) => chart.attributes("data-rows"))).toEqual(["7", "7", "7"]);
  });

  it("lists one row per page, each linking to its own statistics screen", async () => {
    mocks.getOverview.mockResolvedValue({ stats: overview, failed: false });

    const wrapper = mountPage();
    await flushPromises();

    const rows = wrapper.findAll("[data-link-slug]");

    expect(rows.map((row) => row.attributes("data-link-slug"))).toEqual(["my-page", "blog"]);
    expect(rows[0]?.find("a").attributes("data-to")).toContain("l1");
    expect(rows[0]?.text()).toContain("913");
  });
});
