import { DEFAULT_PAGE_THEME } from "@links/blocks";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import LinkPageRenderer from "./link-page-renderer.vue";

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
