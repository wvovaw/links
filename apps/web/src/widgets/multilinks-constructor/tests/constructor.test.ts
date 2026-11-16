import { DEFAULT_PAGE_THEME } from "@links/blocks";
import { UITooltipProvider } from "@links/ui";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { createTestingPinia } from "@pinia/testing";
import { describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";

import PageEditor from "../multilinks-constructor.vue";

describe("testing PageEditor widget", () => {
  /*
    The page awaits its store setup, so it only renders under Suspense (`mountSuspended` supplies it),
    and its toolbar's tooltips need the provider `app.vue` mounts around every page.
  */
  function render() {
    return mountSuspended(
      defineComponent({
        components: { PageEditor, UITooltipProvider },
        template: "<UITooltipProvider><PageEditor linkId='link-1' /></UITooltipProvider>",
      }),
      { global: { plugins: [createTestingPinia({ createSpy: vi.fn })] } },
    );
  }

  it("switches the panel between the three property views", async () => {
    const wrapper = await render();

    const buttons = wrapper.findAll("[data-testid='property-view-button']");
    expect(buttons.map((button) => button.attributes("aria-label"))).toEqual([
      "Blocks properties",
      "Page properties",
      "Theme properties",
    ]);
    expect(buttons[0]?.attributes("aria-pressed")).toBe("true");
    expect(wrapper.text()).toContain("Select a block to edit");

    await buttons[1]!.trigger("click");
    expect(wrapper.find("#page-title-input").exists()).toBe(true);
    expect(buttons[1]?.attributes("aria-pressed")).toBe("true");

    /* A page with no stored theme still shows the defaults: the first edit materialises them. */
    await buttons[2]!.trigger("click");
    expect(wrapper.get("input[aria-label='Accent colour']").element.value).toBe(DEFAULT_PAGE_THEME.accent);
  });
});
