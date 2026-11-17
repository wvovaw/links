import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import PageBlock from "../ui/workspace/page-block.vue";

const props = { isSelected: false, isHidden: false, index: 0, isLast: false };

describe("constructor page links", () => {
  /* The constructor shows a page, it never follows it: a stored link must not leave the editor. */
  it("cancels a click on a link inside the block", () => {
    const wrapper = mount(PageBlock, {
      props,
      slots: { default: '<a class="stored-link" href="https://example.com/">Go</a>' },
    });

    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    wrapper.get(".stored-link").element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("leaves a click that is not on a link alone", () => {
    const wrapper = mount(PageBlock, { props, slots: { default: "<p>Text</p>" } });

    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    wrapper.get("p").element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });
});
