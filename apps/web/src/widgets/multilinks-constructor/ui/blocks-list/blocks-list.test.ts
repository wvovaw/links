import type { VueWrapper } from "@vue/test-utils";

import { BLOCK_ICONS, BLOCK_META, blocksList, LINK_ICONS } from "@links/blocks";
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

  it("emits the picked block's name and leaves adding to the owner", async () => {
    const store = useConstructorStore();
    store.blocks.length = 0;

    await wrapper.find("[data-testid='blocks-list-item']").trigger("click");

    expect(wrapper.emitted("select")?.[0]).toEqual([blocksList[0]?.name]);
    expect(store.blocks.length).toBe(0);
  });

  /*
    A substring is enough: `para` also lands in "separates" in the divider's description, so the test
    asserts the intended block is offered rather than counting every block the word reaches.
  */
  it("filters blocks by a substring of the label or description", async () => {
    await wrapper.find("[data-testid='blocks-search']").setValue("para");

    const labels = wrapper.findAll("[data-testid='blocks-list-item']").map((item) => item.text());
    expect(labels).toContain("Paragraph");
    expect(labels).not.toContain("Button");
  });

  /* `galle` reaches the Picture, whose keywords still name the gallery it cannot draw, and the Gallery. */
  it("filters blocks by a substring of one of their keywords", async () => {
    await wrapper.find("[data-testid='blocks-search']").setValue("galle");

    const labels = wrapper.findAll("[data-testid='blocks-list-item']").map((item) => item.text());
    expect(labels).toContain("Picture");
    expect(labels).toContain("Gallery");
    expect(labels).not.toContain("Button");
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

  it("keeps the link-card icon subset inside the safelist", () => {
    for (const icon of LINK_ICONS) expect(BLOCK_ICONS).toContain(icon);
  });
});
