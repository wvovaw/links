import type { Pinia } from "pinia";
import type { Link } from "~shared/api/backend";

import { DEFAULT_PAGE_THEME } from "@links/blocks";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLinksStore } from "~entities/links";
import { LinkStatus, LinksApi } from "~shared/api/backend";

import { useConstructorStore } from "../model";
import PageRenderer from "../ui/workspace/page-renderer.vue";

const legacyBackground = "background-image: linear-gradient(to top, #13b7c6, #a3009c);";

const legacyLink: Link = {
  id: "link-1",
  slug: "legacy-page",
  title: "Legacy page from before themes",
  blocks: [],
  seo: {},
  background: legacyBackground,
  theme: null,
  status: LinkStatus.PUBLISHED,
};

describe("constructor page theme", () => {
  let pinia: Pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    vi.restoreAllMocks();
  });

  it("keeps a legacy page themeless and previews its stored background", async () => {
    vi.spyOn(LinksApi, "getLink").mockResolvedValue(legacyLink);
    const store = useConstructorStore();
    await store.setupStore("link-1");

    expect(store.theme).toBeNull();

    const wrapper = mount(PageRenderer, { global: { plugins: [pinia] } });
    expect(wrapper.get(".link").attributes("style")).toBe(legacyBackground);
  });

  it("saves no theme for a legacy page nobody re-themed", async () => {
    vi.spyOn(LinksApi, "getLink").mockResolvedValue(legacyLink);
    const store = useConstructorStore();
    await store.setupStore("link-1");

    vi.spyOn(useLinksStore(), "updateLink").mockResolvedValue(true);
    const updateTheme = vi.spyOn(LinksApi, "updateTheme").mockResolvedValue(undefined);

    await store.saveCurrentState();

    expect(updateTheme).not.toHaveBeenCalled();
  });

  it("starts a legacy page from the default theme on the first edit", () => {
    const store = useConstructorStore();
    expect(store.theme).toBeNull();

    store.setTheme({ radius: 4 });

    expect(store.theme).toEqual({ ...DEFAULT_PAGE_THEME, radius: 4 });
  });

  it("keeps the theme and the unsaved mark when the content update is cancelled or fails", async () => {
    const store = useConstructorStore();
    store.linkId = "link-1";
    store.setTheme({ radius: 4 });

    vi.spyOn(useLinksStore(), "updateLink").mockResolvedValue(false);
    const updateTheme = vi.spyOn(LinksApi, "updateTheme").mockResolvedValue(undefined);

    await store.saveCurrentState();

    expect(updateTheme).not.toHaveBeenCalled();
    expect(store.hasUnsavedChanges()).toBe(true);
  });

  it("stores the theme and clears the unsaved mark after a saved content update", async () => {
    const store = useConstructorStore();
    store.linkId = "link-1";
    store.setTheme({ accent: "#445566", radius: 4 });

    vi.spyOn(useLinksStore(), "updateLink").mockResolvedValue(true);
    const updateTheme = vi.spyOn(LinksApi, "updateTheme").mockResolvedValue(undefined);

    await store.saveCurrentState();

    expect(updateTheme).toHaveBeenCalledTimes(1);
    expect(updateTheme.mock.calls[0]?.[0].theme).toMatchObject({ accent: "#445566", radius: 4 });
    expect(store.hasUnsavedChanges()).toBe(false);
  });
});
