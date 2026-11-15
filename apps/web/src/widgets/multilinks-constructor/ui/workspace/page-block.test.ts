import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import PageBlock from "./page-block.vue";

describe("PageBlock hidden affordance", () => {
  it("badges and dims a block its schedule hides but keeps it in the page", () => {
    const wrapper = mount(PageBlock, {
      props: { isSelected: false, isHidden: true },
      slots: { default: `<p class="block-content">Content</p>` },
    });

    expect(wrapper.get("[data-testid='page-block-hidden-badge']").attributes("aria-label")).toBe("Hidden");
    expect(wrapper.get(".block-content").text()).toBe("Content");
    expect(wrapper.get(".block-content").element.parentElement?.className).toContain("opacity-40");
    expect(wrapper.attributes("data-block-hidden")).toBe("true");
  });

  it("leaves a visible block undimmed and unbadged", () => {
    const wrapper = mount(PageBlock, {
      props: { isSelected: false, isHidden: false },
      slots: { default: `<p class="block-content">Content</p>` },
    });

    expect(wrapper.find("[data-testid='page-block-hidden-badge']").exists()).toBe(false);
    expect(wrapper.html()).not.toContain("opacity-40");
    expect(wrapper.attributes("data-block-hidden")).toBe("false");
  });
});
