import type { BlockName, IBlock } from "@links/blocks";

import { createBlock } from "@links/blocks";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import AvatarBlock from "./avatar-block.vue";
import ButtonBlock from "./button-block.vue";
import ParagraphBlock from "./paragraph-block.vue";
import PictureBlock from "./picture-block.vue";

/** A block whose stored values are exactly the ones a page carries, as the renderer passes them. */
function blockOf(name: BlockName, values: Record<string, unknown> = {}): IBlock {
  const block = createBlock(name, "b1");
  for (const [key, value] of Object.entries(values)) {
    const property = block.properties[key];
    if (property) Object.assign(property, { value });
  }
  return block;
}

describe("AvatarBlock", () => {
  it("resolves a stored file id to a served image", () => {
    const wrapper = mount(AvatarBlock, { props: { properties: blockOf("Avatar", { image: "file-123" }).properties } });

    expect(wrapper.get("img").attributes("src")).toMatch(/\/storage\/images\/file-123$/);
  });

  it("leaves a url stored before the uploader alone", () => {
    const wrapper = mount(AvatarBlock, {
      props: { properties: blockOf("Avatar", { image: "https://cdn.example/a.png" }).properties },
    });

    expect(wrapper.get("img").attributes("src")).toBe("https://cdn.example/a.png");
  });

  it("wraps the image in a link without a referrer only when a link is stored", () => {
    const linked = mount(AvatarBlock, {
      props: { properties: blockOf("Avatar", { link: "https://example.com/me" }).properties },
    });
    expect(linked.get("a").attributes("href")).toBe("https://example.com/me");
    expect(linked.get("a").attributes("rel")).toBe("noopener noreferrer");

    const plain = mount(AvatarBlock, { props: { properties: blockOf("Avatar").properties } });
    expect(plain.find("a").exists()).toBe(false);
    expect(plain.find("img").exists()).toBe(true);
  });

  it("applies the stored size and shape", () => {
    const stored = mount(AvatarBlock, {
      props: { properties: blockOf("Avatar", { size: 160, shape: "rounded" }).properties },
    });
    const style = stored.get(".avatar-block").attributes("style") ?? "";
    expect(style).toContain("--avatar-size: 160px");
    expect(style).toContain("--avatar-radius: 12px");

    const legacy = mount(AvatarBlock, { props: { properties: blockOf("Avatar").properties } });
    const legacyStyle = legacy.get(".avatar-block").attributes("style") ?? "";
    expect(legacyStyle).toContain("--avatar-size: 100px");
    expect(legacyStyle).toContain("--avatar-radius: 100%");
  });
});

describe("ButtonBlock", () => {
  const base = { text: "Go", link: "https://example.com" };

  it("opens in a new tab without a referrer by default", () => {
    const wrapper = mount(ButtonBlock, { props: { properties: blockOf("Button", base).properties } });

    expect(wrapper.get("a").attributes("target")).toBe("_blank");
    expect(wrapper.get("a").attributes("rel")).toBe("noopener noreferrer");
  });

  it("keeps the current tab when the switch is off", () => {
    const wrapper = mount(ButtonBlock, {
      props: { properties: blockOf("Button", { ...base, "new-tab": false }).properties },
    });

    expect(wrapper.get("a").attributes("target")).toBeUndefined();
    expect(wrapper.get("a").attributes("rel")).toBeUndefined();
  });

  it("falls back to the md font size token, which exists", () => {
    const wrapper = mount(ButtonBlock, { props: { properties: blockOf("Button", base).properties } });

    const style = wrapper.get(".button-block").attributes("style") ?? "";
    expect(style).toContain("--button-font-size: var(--links-theme-button-font-size-md)");
  });
});

describe("PictureBlock", () => {
  it("renders the stored alt and defaults to lazy loading", () => {
    const wrapper = mount(PictureBlock, {
      props: { properties: blockOf("Picture", { image: "file-1", alt: "A cat" }).properties },
    });

    expect(wrapper.get("img").attributes("alt")).toBe("A cat");
    expect(wrapper.get("img").attributes("loading")).toBe("lazy");
  });

  it("keeps the picture decorative when it was stored without alt text", () => {
    const wrapper = mount(PictureBlock, { props: { properties: blockOf("Picture", { image: "file-1" }).properties } });

    expect(wrapper.get("img").attributes("alt")).toBe("");
  });

  it("wraps the picture in a link without a referrer only when a link is stored", () => {
    const linked = mount(PictureBlock, {
      props: { properties: blockOf("Picture", { image: "file-1", link: "https://example.com" }).properties },
    });
    expect(linked.get("a").attributes("rel")).toBe("noopener noreferrer");

    const plain = mount(PictureBlock, { props: { properties: blockOf("Picture", { image: "file-1" }).properties } });
    expect(plain.find("a").exists()).toBe(false);
  });

  it("reserves the fallback box only while there is no image", () => {
    const empty = mount(PictureBlock, { props: { properties: blockOf("Picture").properties } });
    expect(empty.find(".picture-block__placeholder").exists()).toBe(true);
    expect(empty.find("img").exists()).toBe(false);

    const filled = mount(PictureBlock, { props: { properties: blockOf("Picture", { image: "file-1" }).properties } });
    expect(filled.find(".picture-block__placeholder").exists()).toBe(false);
    expect(filled.find("img").exists()).toBe(true);
  });

  it("keeps the theme radius as the fallback", () => {
    const wrapper = mount(PictureBlock, { props: { properties: blockOf("Picture", { image: "file-1" }).properties } });

    const style = wrapper.get(".picture-block").attributes("style") ?? "";
    expect(style).toContain("--picture-radius: var(--links-theme-picture-radius)");
  });

  it("applies the stored object-fit and radius", () => {
    const wrapper = mount(PictureBlock, {
      props: { properties: blockOf("Picture", { "image": "file-1", "object-fit": "contain", "radius": 4 }).properties },
    });

    const style = wrapper.get(".picture-block").attributes("style") ?? "";
    expect(style).toContain("--picture-object-fit: contain");
    expect(style).toContain("--picture-radius: 4px");
  });
});

describe("ParagraphBlock", () => {
  it("renders the stored alignment and font size", () => {
    const wrapper = mount(ParagraphBlock, {
      props: {
        properties: blockOf("Paragraph", {
          "text": "Hello",
          "align": "right",
          "font-size": "var(--links-theme-paragraph-font-size-lg)",
        }).properties,
      },
    });

    const style = wrapper.get(".paragraph-block").attributes("style") ?? "";
    expect(style).toContain("--paragraph-align: right");
    expect(style).toContain("--paragraph-font-size: var(--links-theme-paragraph-font-size-lg)");
  });

  it("keeps a paragraph stored without them centred at the md token", () => {
    const block = blockOf("Paragraph", { text: "Hello" });
    delete block.properties.align;
    delete block.properties["font-size"];

    const wrapper = mount(ParagraphBlock, { props: { properties: block.properties } });

    const style = wrapper.get(".paragraph-block").attributes("style") ?? "";
    expect(style).toContain("--paragraph-align: center");
    expect(style).toContain("--paragraph-font-size: var(--links-theme-paragraph-font-size-md)");
  });
});
