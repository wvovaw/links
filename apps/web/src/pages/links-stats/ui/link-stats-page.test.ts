import type { LinkStats } from "~shared/api/backend";

import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getLinkStats: vi.fn(), getLink: vi.fn() }));

vi.mock("~shared/api/backend", () => ({
  AnalyticsApi: { getLinkStats: mocks.getLinkStats },
  LinksApi: { getLink: mocks.getLink },
}));

import LinkStatsPage from "./link-stats-page.vue";

const stats: LinkStats = {
  totals: { views: 913, visitors: 620, clicks: 187 },
  timeseries: [{ date: "2026-11-17", views: 42, visitors: 31, clicks: 9 }],
  sources: [{ source: "t.me", medium: "social", views: 305, visitors: 244, clicks: 70 }],
  blocks: [{ blockId: "b1", clicks: 120, visitors: 88 }],
};

function mountPage() {
  return mount(LinkStatsPage, { props: { linkId: "l1" } });
}

describe("LinkStatsPage", () => {
  beforeEach(() => {
    mocks.getLinkStats.mockReset();
    mocks.getLink.mockReset();
    mocks.getLink.mockResolvedValue({ id: "l1", blocks: [{ id: "b1", name: "Button" }] });
  });

  it("shows the page's totals and its blocks", async () => {
    mocks.getLinkStats.mockResolvedValue({ stats, failed: false });

    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.get("[data-metric='views'] dd").text()).toBe("913");

    const block = wrapper.get("[data-block-id='b1']");

    expect(block.text()).toContain("Button");
    expect(block.text()).toContain("120");
  });

  /* A rate over no visits does not exist: the cell says so rather than printing NaN. */
  it("shows CTR as a dash when the page has no visits", async () => {
    mocks.getLinkStats.mockResolvedValue({
      stats: { ...stats, totals: { views: 0, visitors: 0, clicks: 0 }, blocks: [] },
      failed: false,
    });

    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.get("[data-metric='ctr'] dd").text()).toBe("—");
  });

  it("asks again with a new window when the range changes", async () => {
    mocks.getLinkStats.mockResolvedValue({ stats, failed: false });

    const wrapper = mountPage();
    await flushPromises();

    await wrapper.get("[data-preset='30d']").trigger("click");
    await flushPromises();

    expect(mocks.getLinkStats).toHaveBeenCalledTimes(2);
    expect(mocks.getLinkStats.mock.calls[0]?.[1]).not.toEqual(mocks.getLinkStats.mock.calls[1]?.[1]);
  });
});
