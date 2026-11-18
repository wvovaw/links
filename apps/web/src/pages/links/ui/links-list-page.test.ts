import type { Link, OverviewStats } from "~shared/api/backend";

import { flushPromises, mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LinkStatus } from "~shared/api/backend";

const mocks = vi.hoisted(() => ({ getOverview: vi.fn(), listLinks: vi.fn() }));

vi.mock("~shared/api/backend", async (importOriginal) => ({
  ...(await importOriginal<typeof import("~shared/api/backend")>()),
  AnalyticsApi: { getOverview: mocks.getOverview },
  LinksApi: { listLinks: mocks.listLinks },
}));

import LinksListPage from "./links-list-page.vue";

const overview: OverviewStats = {
  totals: { views: 1284, visitors: 913, clicks: 247 },
  previous: { views: 1000, visitors: 900, clicks: 200 },
  timeseries: [{ date: "2026-11-17", views: 42, visitors: 31, clicks: 9 }],
  sources: [],
  links: [{ id: "l1", slug: "my-page", title: "My page", views: 9, visitors: 4, clicks: 3, spark: [] }],
};

const page: Link = {
  id: "l1",
  slug: "my-page",
  title: "My page",
  blocks: [],
  seo: {},
  background: "",
  theme: null,
  status: LinkStatus.PUBLISHED,
  updatedAt: "2026-11-08T09:00:00.000Z",
};

/** The dialog and the form behind it ask for a router and a backend; the page's job is to offer them. */
const stubs = {
  NuxtLinkLocale: {
    props: { to: { type: [String, Object], required: true } },
    template: `<a :data-to="JSON.stringify(to)"><slot /></a>`,
  },
  CreateNewLinkDialog: { template: `<div><slot /></div>` },
  CreateNewLinkForm: { template: `<form />` },
};

function mountPage() {
  return mount(LinksListPage, { global: { stubs, plugins: [createPinia()] } });
}

describe("LinksListPage", () => {
  beforeEach(() => {
    mocks.getOverview.mockReset();
    mocks.listLinks.mockReset();
    mocks.listLinks.mockResolvedValue([page]);
  });

  it("shows the window's totals on the cards", async () => {
    mocks.getOverview.mockResolvedValue({ stats: overview, failed: false });

    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.get("[data-metric='clicks'] dd span").text()).toBe("247");
    expect(wrapper.get("[data-metric='visitors'] dd span").text()).toBe("913");
    expect(wrapper.get("[data-metric='ctr'] dd").text()).toContain("19%");
  });

  it("lists the owner's pages with the numbers counted for them", async () => {
    mocks.getOverview.mockResolvedValue({ stats: overview, failed: false });

    const wrapper = mountPage();
    await flushPromises();

    const row = wrapper.get("[data-link-slug='my-page']");

    expect(row.attributes("data-clicks")).toBe("3");
    expect(row.attributes("data-visitors")).toBe("4");
    expect(row.text()).toContain("Nov 8, 2026");
  });

  /* "Nothing yet" and "we could not ask" are different facts, and a screen of zeros would tell the wrong one. */
  it("shows the failed state, and no rows, when the overview could not be read", async () => {
    mocks.getOverview.mockResolvedValue({ stats: null, failed: true });

    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.find("[data-testid='stats-failed']").exists()).toBe(true);
    expect(wrapper.find("[data-metric='clicks']").exists()).toBe(false);
    expect(wrapper.find("[data-link-slug]").exists()).toBe(false);
  });

  /* The screen opens on the mockup's window: a month back, not the week the per-page charts default to. */
  it("asks the overview for the last 30 days", async () => {
    mocks.getOverview.mockResolvedValue({ stats: overview, failed: false });

    await mountPage();
    await flushPromises();

    const call = mocks.getOverview.mock.calls[0] as [{ from: string; to: string }];
    const { from, to } = call[0];

    expect(Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000)).toBe(29);
  });
});
