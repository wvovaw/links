import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import PageBlock from "./page-block.vue";

describe("PageBlock hidden affordance", () => {
  it("badges and dims a block its schedule hides but keeps it in the page", () => {
    const wrapper = mount(PageBlock, {
      props: { isSelected: false, isHidden: true, index: 0, isLast: false },
      slots: { default: `<p class="block-content">Content</p>` },
    });

    expect(wrapper.get("[data-testid='page-block-hidden-badge']").attributes("aria-label")).toBe("Hidden");
    expect(wrapper.get(".block-content").text()).toBe("Content");
    expect(wrapper.get(".block-content").element.parentElement?.className).toContain("opacity-40");
    expect(wrapper.attributes("data-block-hidden")).toBe("true");
  });

  it("leaves a visible block undimmed and unbadged", () => {
    const wrapper = mount(PageBlock, {
      props: { isSelected: false, isHidden: false, index: 0, isLast: false },
      slots: { default: `<p class="block-content">Content</p>` },
    });

    expect(wrapper.find("[data-testid='page-block-hidden-badge']").exists()).toBe(false);
    expect(wrapper.html()).not.toContain("opacity-40");
    expect(wrapper.attributes("data-block-hidden")).toBe("false");
  });
});

describe("PageBlock insertion points", () => {
  const props = { isSelected: false, isHidden: false, index: 2 };

  it("offers one point above the block and a second below the last one", () => {
    const alone = mount(PageBlock, { props: { ...props, isLast: true }, slots: { default: "<p />" } });
    const middle = mount(PageBlock, { props: { ...props, isLast: false }, slots: { default: "<p />" } });

    expect(alone.findAll("[data-testid='insert-block']")).toHaveLength(2);
    expect(middle.findAll("[data-testid='insert-block']")).toHaveLength(1);
  });

  it("reports the index it would insert at, and the end for the last block's lower point", async () => {
    const wrapper = mount(PageBlock, { props: { ...props, isLast: true }, slots: { default: "<p />" } });
    const [above, below] = wrapper.findAll("[data-testid='insert-block']");

    await above!.trigger("click");
    await below!.trigger("click");

    expect(wrapper.emitted("insert")).toEqual([[2], [3]]);
  });

  /* The wrapper spans the block's full width: without this, an invisible strip eats the block's edge. */
  it("catches pointer events only on the marker button", () => {
    const wrapper = mount(PageBlock, { props: { ...props, isLast: false }, slots: { default: "<p />" } });
    const marker = wrapper.get("[data-testid='insert-block']");

    expect(marker.classes()).toContain("pointer-events-auto");
    expect(marker.element.parentElement?.className).toContain("pointer-events-none");
  });
});
