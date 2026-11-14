import type { VueWrapper } from "@vue/test-utils";

import { BLOCK_ICONS, BLOCK_META } from "@links/blocks";
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { createI18n } from "vue-i18n";

import { useConstructorStore } from "../../model";
import BlocksList from "./blocks-list.vue";

describe("testing BlocksList component", () => {
  let wrapper: VueWrapper;
  beforeEach(() => {
    wrapper = mount(BlocksList, {
      global: {
        plugins: [createPinia()],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("can add a block on click", async () => {
    await wrapper.find("[data-testid='blocks-list-item']").trigger("click");
    const store = useConstructorStore();
    expect(store.blocks.length).toBeGreaterThan(0);
    expect(store.selectedBlockId).toBe(store.blocks[0]?.id);
  });

  it("filters blocks by the search query", async () => {
    await wrapper.find("[data-testid='blocks-search']").setValue("para");

    const items = wrapper.findAll("[data-testid='blocks-list-item']");
    expect(items).toHaveLength(1);
    expect(items[0]?.text()).toContain("Paragraph");
  });

  it("groups blocks by category", () => {
    const groups = wrapper.findAll("[data-testid='blocks-group']");
    expect(groups.length).toBeGreaterThan(0);
  });

  it("filters blocks by the translated label", async () => {
    const i18n = createI18n({
      legacy: false,
      locale: "ru",
      messages: { ru: { "blocks.Avatar.label": "Аватар" } },
    });
    const localized = mount(BlocksList, {
      global: {
        plugins: [createPinia(), i18n],
      },
    });

    await localized.find("[data-testid='blocks-search']").setValue("ават");

    const items = localized.findAll("[data-testid='blocks-list-item']");
    expect(items).toHaveLength(1);
    expect(items[0]?.text()).toContain("Аватар");
  });

  it("emits select when a block is picked", async () => {
    await wrapper.find("[data-testid='blocks-list-item']").trigger("click");

    expect(wrapper.emitted("select")).toHaveLength(1);
  });
});

describe("testing the block palette metadata", () => {
  it("pins every metadata icon into the safelist", () => {
    for (const meta of Object.values(BLOCK_META)) expect(BLOCK_ICONS).toContain(meta.icon);
  });
});
