import type { IBlock } from "@links/blocks";

import { createBlock, DEFAULT_PAGE_THEME } from "@links/blocks";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";

import LinkPageRenderer from "./link-page-renderer.vue";

/**
 * The real resolver loads each block component lazily, so a test cannot await it; a stub that prints
 * the block's text is enough to read back which blocks the renderer put into the markup.
 */
vi.mock("~shared/blocks/use-blocks-resolver", () => ({
  useBlocksResolver: () => ({
    resolve: () =>
      defineComponent({
        props: ["properties"],
        template: `<div class="stub-block">{{ properties.text.value }}</div>`,
      }),
  }),
}));

const legacy = "background-image: linear-gradient(to top, #13b7c6, #a3009c);";

describe("LinkPageRenderer page background ownership", () => {
  it("leaves the page background alone when the caller passes neither theme nor background", () => {
    const wrapper = mount(LinkPageRenderer, { props: { blocks: [] } });

    expect(wrapper.get(".link").attributes("style")).toBeUndefined();
  });

  it("paints the theme style itself when the caller passes a theme", () => {
    const wrapper = mount(LinkPageRenderer, {
      props: { blocks: [], theme: { ...DEFAULT_PAGE_THEME, accent: "#112233" }, background: legacy },
    });

    expect(wrapper.get(".link").attributes("style")).toContain("--links-page-accent: #112233");
  });

  it("keeps a passed legacy background string unchanged", () => {
    const wrapper = mount(LinkPageRenderer, { props: { blocks: [], theme: null, background: legacy } });

    expect(wrapper.get(".link").attributes("style")).toBe(legacy);
  });
});

function paragraphWith(text: string, visibility?: IBlock["visibility"]): IBlock {
  const block = createBlock("Paragraph", `p-${text}`);
  block.properties.text.value = text;
  block.visibility = visibility;
  return block;
}

describe("LinkPageRenderer block visibility", () => {
  it("leaves a block its schedule hides out of the markup instead of hiding it with css", () => {
    const wrapper = mount(LinkPageRenderer, {
      props: { blocks: [paragraphWith("Shown text"), paragraphWith("Hidden text", { hidden: true })] },
    });

    expect(wrapper.text()).toContain("Shown text");
    expect(wrapper.text()).not.toContain("Hidden text");
    expect(wrapper.html()).not.toContain("Hidden");
  });

  it("drops a block whose schedule has ended and keeps one whose schedule has started", () => {
    const ended = paragraphWith("Ended text", { to: "2020-01-01T00:00:00.000Z" });
    const started = paragraphWith("Started text", { from: "2020-01-01T00:00:00.000Z" });

    const wrapper = mount(LinkPageRenderer, { props: { blocks: [ended, started] } });

    expect(wrapper.text()).not.toContain("Ended text");
    expect(wrapper.text()).toContain("Started text");
  });
});
