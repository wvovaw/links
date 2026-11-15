import type { BlockName, IBlock } from "@links/blocks";

import { createBlock } from "@links/blocks";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import AvatarBlock from "./avatar-block.vue";
import ButtonBlock from "./button-block.vue";
import DividerBlock from "./divider-block.vue";
import HeadingBlock from "./heading-block.vue";
import ParagraphBlock from "./paragraph-block.vue";
import PictureBlock from "./picture-block.vue";
import SpacerBlock from "./spacer-block.vue";
import VideoBlock from "./video-block.vue";

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

  it("falls back to the theme border colour so the page variant reaches the button", () => {
    const wrapper = mount(ButtonBlock, { props: { properties: blockOf("Button", base).properties } });

    const style = wrapper.get(".button-block").attributes("style") ?? "";
    expect(style).toContain("--button-border: var(--links-theme-button-border, #eee)");
  });

  it("keeps the height and radius a stored button already rendered at", () => {
    const wrapper = mount(ButtonBlock, { props: { properties: blockOf("Button", base).properties } });

    const style = wrapper.get(".button-block").attributes("style") ?? "";
    expect(style).toContain("--button-height: 56px");
    expect(style).toContain("--button-radius: 8px");
  });

  it("takes the height and radius from the stored properties", () => {
    const wrapper = mount(ButtonBlock, {
      props: { properties: blockOf("Button", { ...base, height: 72, radius: 16 }).properties },
    });

    const style = wrapper.get(".button-block").attributes("style") ?? "";
    expect(style).toContain("--button-height: 72px");
    expect(style).toContain("--button-radius: 16px");
  });

  it("renders a plain link exactly as before, with no card parts", () => {
    const wrapper = mount(ButtonBlock, { props: { properties: blockOf("Button", base).properties } });

    const link = wrapper.get(".button-block");
    expect(link.classes()).not.toContain("button-block--card");
    expect(link.find(".button-block__thumbnail").exists()).toBe(false);
    expect(link.find(".button-block__subtitle").exists()).toBe(false);
    expect(link.find(".button-block__icon").exists()).toBe(false);
    expect(link.get(".button-block__text").text()).toBe("Go");
  });

  it("puts a thumbnail, a subtitle and an icon around the text in one row", () => {
    const wrapper = mount(ButtonBlock, {
      props: {
        properties: blockOf("Button", {
          ...base,
          thumbnail: "https://cdn.example/card.png",
          subtitle: "A short note",
          icon: "i-lucide:link",
        }).properties,
      },
    });

    const link = wrapper.get(".button-block");
    expect(link.classes()).toContain("button-block--card");
    expect(link.get(".button-block__thumbnail").attributes("src")).toBe("https://cdn.example/card.png");
    expect(link.get(".button-block__subtitle").text()).toBe("A short note");
    expect(link.get(".button-block__icon").classes()).toContain("i-lucide:link");
  });

  it("resolves a stored thumbnail file id to a served image", () => {
    const wrapper = mount(ButtonBlock, {
      props: { properties: blockOf("Button", { ...base, thumbnail: "file-123" }).properties },
    });

    expect(wrapper.get(".button-block__thumbnail").attributes("src")).toMatch(/\/storage\/images\/file-123$/);
  });

  it.each([
    ["inherit", { "--button-bg": "var(--links-theme-button-bg)", "--button-fg": "var(--links-theme-button-fg)" }],
    ["solid", { "--button-bg": "var(--links-page-accent)", "--button-fg": "#fff", "--button-border-width": "0" }],
    [
      "outline",
      {
        "--button-bg": "transparent",
        "--button-fg": "var(--links-page-accent)",
        "--button-border": "var(--links-page-accent)",
        "--button-border-width": "1px",
      },
    ],
    [
      "ghost",
      {
        "--button-bg": "transparent",
        "--button-fg": "var(--links-page-accent)",
        "--button-border": "transparent",
        "--button-border-width": "0",
      },
    ],
  ])("draws the %s variant", (variant, expected) => {
    const wrapper = mount(ButtonBlock, {
      props: { properties: blockOf("Button", { ...base, variant }).properties },
    });

    const style = wrapper.get(".button-block").attributes("style") ?? "";
    for (const [token, value] of Object.entries(expected)) expect(style).toContain(`${token}: ${value}`);
  });

  it("keeps the block's own colours over the variant accent", () => {
    const solid = mount(ButtonBlock, {
      props: {
        properties: blockOf("Button", { ...base, variant: "solid", background: "#111111", foreground: "#222222" })
          .properties,
      },
    });

    const solidStyle = solid.get(".button-block").attributes("style") ?? "";
    expect(solidStyle).toContain("--button-bg: #111111");
    expect(solidStyle).toContain("--button-fg: #222222");

    /* An outline is transparent by definition, so it never draws a stored background. */
    const outline = mount(ButtonBlock, {
      props: {
        properties: blockOf("Button", { ...base, variant: "outline", background: "#111111", border: "#333333" })
          .properties,
      },
    });

    const outlineStyle = outline.get(".button-block").attributes("style") ?? "";
    expect(outlineStyle).toContain("--button-bg: transparent");
    expect(outlineStyle).toContain("--button-border: #333333");
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

describe("HeadingBlock", () => {
  it("renders the text as a real h2 by default", () => {
    const wrapper = mount(HeadingBlock, { props: { properties: blockOf("Heading", { text: "Hello" }).properties } });

    expect(wrapper.get("h2.heading-block__text").text()).toBe("Hello");
  });

  it.each(["h1", "h2", "h3"])("renders the stored %s level", (level) => {
    const wrapper = mount(HeadingBlock, {
      props: { properties: blockOf("Heading", { text: "Hello", level }).properties },
    });

    expect(wrapper.find(level).exists()).toBe(true);
  });

  it("falls back to h2 for a level outside the palette", () => {
    const wrapper = mount(HeadingBlock, {
      props: { properties: blockOf("Heading", { text: "Hello", level: "script" }).properties },
    });

    expect(wrapper.get("h2.heading-block__text").text()).toBe("Hello");
  });

  it("renders no heading without text, keeping only the empty box", () => {
    const empty = mount(HeadingBlock, { props: { properties: blockOf("Heading").properties } });
    expect(empty.find("h1, h2, h3").exists()).toBe(false);
    expect(empty.get(".heading-block").text()).toBe("");

    const blank = mount(HeadingBlock, { props: { properties: blockOf("Heading", { text: "" }).properties } });
    expect(blank.find("h1, h2, h3").exists()).toBe(false);
  });

  it("centres the heading by default", () => {
    const wrapper = mount(HeadingBlock, { props: { properties: blockOf("Heading", { text: "Hello" }).properties } });

    expect(wrapper.get(".heading-block").attributes("style")).toContain("--heading-align: center");
  });

  it("takes the alignment from the stored property", () => {
    const wrapper = mount(HeadingBlock, {
      props: { properties: blockOf("Heading", { text: "Hello", align: "left" }).properties },
    });

    expect(wrapper.get(".heading-block").attributes("style")).toContain("--heading-align: left");
  });
});

describe("DividerBlock", () => {
  it("draws a line in the theme colour by default", () => {
    const wrapper = mount(DividerBlock, { props: { properties: blockOf("Divider").properties } });

    const line = wrapper.get("hr.divider-block");
    expect(line.classes()).toContain("divider-block--line");
    const style = line.attributes("style") ?? "";
    expect(style).toContain("--divider-color: var(--links-page-fg)");
    expect(style).toContain("--divider-spacing: 16px");
  });

  it.each(["line", "dashed", "dotted"])("draws the %s style as a line", (style) => {
    const wrapper = mount(DividerBlock, { props: { properties: blockOf("Divider", { style }).properties } });

    expect(wrapper.get("hr.divider-block").classes()).toContain(`divider-block--${style}`);
  });

  it("draws a gap instead of a line for the space style", () => {
    const wrapper = mount(DividerBlock, {
      props: { properties: blockOf("Divider", { style: "space", spacing: 40 }).properties },
    });

    expect(wrapper.find("hr").exists()).toBe(false);
    const gap = wrapper.get("div.divider-block--space");
    expect(gap.attributes("style")).toContain("--divider-spacing: 40px");
  });

  it("draws a stored colour exactly", () => {
    const wrapper = mount(DividerBlock, {
      props: { properties: blockOf("Divider", { color: "#ff0000" }).properties },
    });

    const style = wrapper.get("hr.divider-block").attributes("style") ?? "";
    expect(style).toContain("--divider-color: #ff0000");
    expect(style).toContain("--divider-opacity: 1");
  });
});

describe("SpacerBlock", () => {
  it("renders the default height", () => {
    const wrapper = mount(SpacerBlock, { props: { properties: blockOf("Spacer").properties } });

    expect(wrapper.get(".spacer-block").attributes("style")).toContain("height: 24px");
  });

  it("renders the stored height", () => {
    const wrapper = mount(SpacerBlock, { props: { properties: blockOf("Spacer", { height: 120 }).properties } });

    expect(wrapper.get(".spacer-block").attributes("style")).toContain("height: 120px");
    expect(wrapper.get(".spacer-block").text()).toBe("");
  });

  it("keeps the default when a stored spacer has no height", () => {
    const block = blockOf("Spacer");
    delete block.properties.height;

    const wrapper = mount(SpacerBlock, { props: { properties: block.properties } });

    expect(wrapper.get(".spacer-block").attributes("style")).toContain("height: 24px");
  });
});

describe("VideoBlock", () => {
  const youtube = { provider: "youtube", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" };

  function frameOf(values: Record<string, unknown>) {
    return mount(VideoBlock, { props: { properties: blockOf("Video", values).properties } }).get("iframe");
  }

  it("embeds the mapped link in the provider's own player", () => {
    const frame = frameOf(youtube);

    expect(frame.attributes("src")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(frame.attributes("title")).toBe("Video");
    expect(frame.attributes("loading")).toBe("lazy");
    expect(frame.attributes("allow")).toBe("autoplay; encrypted-media; picture-in-picture; fullscreen");
    expect(frame.attributes("allowfullscreen")).toBe("");
  });

  it("maps a tiktok share link to its player", () => {
    const frame = frameOf({ provider: "tiktok", url: "https://www.tiktok.com/@user/video/7312345678901234567" });

    expect(frame.attributes("src")).toBe("https://www.tiktok.com/player/v1/7312345678901234567");
  });

  it("starts autoplay muted, because a browser blocks a noisy one", () => {
    expect(frameOf({ ...youtube, autoplay: true }).attributes("src")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1",
    );
  });

  it.each([
    ["youtube", { ...youtube, muted: true }, "https://www.youtube.com/embed/dQw4w9WgXcQ?mute=1"],
    [
      "vimeo",
      { provider: "vimeo", url: "https://vimeo.com/123456789", loop: true, muted: true },
      "https://player.vimeo.com/video/123456789?loop=1&muted=1",
    ],
    [
      "tiktok",
      { provider: "tiktok", url: "https://www.tiktok.com/@user/video/7312345678901234567", muted: true },
      "https://www.tiktok.com/player/v1/7312345678901234567?muted=1",
    ],
  ])("spells the %s playback flags the way the provider does", (_provider, values, expected) => {
    expect(frameOf(values).attributes("src")).toBe(expected);
  });

  it("gives youtube loop the playlist that names the single video", () => {
    expect(frameOf({ ...youtube, loop: true }).attributes("src")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ?loop=1&playlist=dQw4w9WgXcQ",
    );
  });

  it("draws the stored aspect and radius", () => {
    const wrapper = mount(VideoBlock, {
      props: { properties: blockOf("Video", { ...youtube, aspect: "9:16", radius: 16 }).properties },
    });

    const style = wrapper.get(".video-block").attributes("style") ?? "";
    expect(style).toContain("--video-aspect: 9 / 16");
    expect(style).toContain("--video-radius: 16px");
  });

  it("keeps the 16:9 frame and the default radius when they are not stored", () => {
    const style = mount(VideoBlock, { props: { properties: blockOf("Video", youtube).properties } })
      .get(".video-block")
      .attributes("style");

    expect(style).toContain("--video-aspect: 16 / 9");
    expect(style).toContain("--video-radius: 8px");
  });

  it.each([
    ["a link of another site", "https://example.com/watch?v=1"],
    ["no link at all", ""],
  ])("shows the stored link instead of an iframe for %s", (_case, url) => {
    const wrapper = mount(VideoBlock, { props: { properties: blockOf("Video", { ...youtube, url }).properties } });

    expect(wrapper.find("iframe").exists()).toBe(false);
    expect(wrapper.get(".video-block__placeholder").text()).toBe(url);
  });
});
