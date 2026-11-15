import type { BlockName, IBlock } from "@links/blocks";
import type { VueWrapper } from "@vue/test-utils";

import { createBlock } from "@links/blocks";
import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import AvatarBlock from "./avatar-block.vue";
import ButtonBlock from "./button-block.vue";
import CountdownBlock from "./countdown-block.vue";
import DividerBlock from "./divider-block.vue";
import HeadingBlock from "./heading-block.vue";
import MapBlock from "./map-block.vue";
import MusicBlock from "./music-block.vue";
import ParagraphBlock from "./paragraph-block.vue";
import PictureBlock from "./picture-block.vue";
import QrCodeBlock from "./qr-code-block.vue";
import SocialIconsBlock from "./social-icons-block.vue";
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

  /*
    The link property is free text the API never validates, so a stored `javascript:` href would run in
    the page's own origin the moment a visitor clicked the avatar.
  */
  it("leaves the avatar unlinked for a stored script url", () => {
    const wrapper = mount(AvatarBlock, {
      props: { properties: blockOf("Avatar", { link: "javascript:alert(1)" }).properties },
    });

    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.find("img").exists()).toBe(true);
    expect(wrapper.html()).not.toContain("javascript:");
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

  /* A legacy button stored neither property, so the stylesheet's rem default stays in charge. */
  it("emits no height or radius variable for a button that stores neither", () => {
    const wrapper = mount(ButtonBlock, { props: { properties: blockOf("Button", base).properties } });

    const style = wrapper.get(".button-block").attributes("style") ?? "";
    expect(style).not.toContain("--button-height");
    expect(style).not.toContain("--button-radius");
  });

  it("takes the height and radius from the stored properties", () => {
    const wrapper = mount(ButtonBlock, {
      props: { properties: blockOf("Button", { ...base, height: 72, radius: 16 }).properties },
    });

    const style = wrapper.get(".button-block").attributes("style") ?? "";
    expect(style).toContain("--button-height: 72px");
    expect(style).toContain("--button-radius: 16px");
  });

  /* The field's min/max are HTML attributes, so an over-typed or cleared value still reaches the page. */
  it.each([
    ["", "56"],
    [5000, "96"],
  ])("clamps a stored height of %s to %spx", (height, expected) => {
    const wrapper = mount(ButtonBlock, { props: { properties: blockOf("Button", { ...base, height }).properties } });

    const style = wrapper.get(".button-block").attributes("style") ?? "";
    expect(style).toContain(`--button-height: ${expected}px`);
  });

  /*
    The link field is free text and the API stores the block JSON unvalidated, so a stored `javascript:`
    href would run in the page's own origin the moment a visitor clicked the button.
  */
  it.each([["javascript:alert(1)"], ["data:text/html,<script>alert(1)</script>"], ["vbscript:msgbox(1)"]])(
    "keeps only the text for the stored link %s",
    (link) => {
      const wrapper = mount(ButtonBlock, { props: { properties: blockOf("Button", { ...base, link }).properties } });

      expect(wrapper.get("a").attributes("href")).toBeUndefined();
      expect(wrapper.get("a").text()).toBe("Go");
    },
  );

  /* `None` is the option that clears the icon; the schema cannot carry the empty string as a value. */
  it("draws no icon when the icon option is None", () => {
    const wrapper = mount(ButtonBlock, {
      props: { properties: blockOf("Button", { ...base, icon: "none" }).properties },
    });

    expect(wrapper.find(".button-block__icon").exists()).toBe(false);
    expect(wrapper.get(".button-block__text").text()).toBe("Go");
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

  /* Same class as the avatar and the button: only a web address may become the picture's href. */
  it("leaves the picture unlinked for a stored script url", () => {
    const wrapper = mount(PictureBlock, {
      props: { properties: blockOf("Picture", { image: "file-1", link: "javascript:alert(1)" }).properties },
    });

    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.find("img").exists()).toBe(true);
    expect(wrapper.html()).not.toContain("javascript:");
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

  it.each([
    ["", "var(--links-theme-picture-radius)"],
    [5000, "40px"],
  ])("clamps a stored radius of %s to %s", (radius, expected) => {
    const wrapper = mount(PictureBlock, {
      props: { properties: blockOf("Picture", { image: "file-1", radius: radius }).properties },
    });

    expect(wrapper.get(".picture-block").attributes("style")).toContain(`--picture-radius: ${expected}`);
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

  it.each([
    ["", "16px"],
    [5000, "64px"],
  ])("clamps a stored spacing of %s to %s", (spacing, expected) => {
    const wrapper = mount(DividerBlock, { props: { properties: blockOf("Divider", { spacing }).properties } });

    expect(wrapper.get("hr.divider-block").attributes("style")).toContain(`--divider-spacing: ${expected}`);
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

  it.each([
    ["", "24px"],
    [5000, "200px"],
  ])("clamps a stored height of %s to %s", (height, expected) => {
    const wrapper = mount(SpacerBlock, { props: { properties: blockOf("Spacer", { height }).properties } });

    expect(wrapper.get(".spacer-block").attributes("style")).toContain(`height: ${expected}`);
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

  it.each([
    ["", "8px"],
    [5000, "32px"],
  ])("clamps a stored radius of %s to %s", (radius, expected) => {
    const style = mount(VideoBlock, { props: { properties: blockOf("Video", { ...youtube, radius }).properties } })
      .get(".video-block")
      .attributes("style");

    expect(style).toContain(`--video-radius: ${expected}`);
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

describe("MusicBlock", () => {
  const spotify = { provider: "spotify", url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT" };

  function frameOf(values: Record<string, unknown>) {
    return mount(MusicBlock, { props: { properties: blockOf("Music", values).properties } }).get("iframe");
  }

  it("embeds the mapped link in the provider's own player", () => {
    const frame = frameOf(spotify);

    expect(frame.attributes("src")).toBe("https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT");
    expect(frame.attributes("title")).toBe("Music");
    expect(frame.attributes("loading")).toBe("lazy");
  });

  it.each([
    [
      "soundcloud",
      "https://soundcloud.com/artist/track",
      `https://w.soundcloud.com/player/?url=${encodeURIComponent("https://soundcloud.com/artist/track")}`,
    ],
    [
      "apple-music",
      "https://music.apple.com/us/album/x/1234567890",
      "https://embed.music.apple.com/us/album/x/1234567890",
    ],
    ["youtube-music", "https://music.youtube.com/watch?v=dQw4w9WgXcQ", "https://www.youtube.com/embed/dQw4w9WgXcQ"],
  ])("maps a %s link to its player", (provider, url, expected) => {
    expect(frameOf({ provider, url }).attributes("src")).toBe(expected);
  });

  it.each([
    ["compact", "152px"],
    ["full", "352px"],
  ])("draws the %s height", (height, expected) => {
    const style = mount(MusicBlock, { props: { properties: blockOf("Music", { ...spotify, height }).properties } })
      .get(".music-block")
      .attributes("style");

    expect(style).toContain(`--music-height: ${expected}`);
  });

  it("keeps the compact height when none is stored", () => {
    const block = blockOf("Music", spotify);
    delete block.properties.height;

    const style = mount(MusicBlock, { props: { properties: block.properties } })
      .get(".music-block")
      .attributes("style");

    expect(style).toContain("--music-height: 152px");
  });

  it("falls back to spotify for a provider outside the palette", () => {
    expect(frameOf({ provider: "deezer", url: spotify.url }).attributes("src")).toBe(
      "https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT",
    );
  });

  it.each([
    ["a link of another site", "https://example.com/x"],
    ["no link at all", ""],
  ])("shows the stored link instead of an iframe for %s", (_case, url) => {
    const wrapper = mount(MusicBlock, { props: { properties: blockOf("Music", { ...spotify, url }).properties } });

    expect(wrapper.find("iframe").exists()).toBe(false);
    expect(wrapper.get(".music-block__placeholder").text()).toBe(url);
  });

  it("shows the stored link for an apple music artist page, which has no player", () => {
    const url = "https://music.apple.com/us/artist/artist-name/1234567890";
    const wrapper = mount(MusicBlock, {
      props: { properties: blockOf("Music", { provider: "apple-music", url }).properties },
    });

    expect(wrapper.find("iframe").exists()).toBe(false);
    expect(wrapper.get(".music-block__placeholder").text()).toBe(url);
  });
});

describe("QrCodeBlock", () => {
  const me = "https://links.example/me";

  function wrapperOf(values: Record<string, unknown> = {}) {
    return mount(QrCodeBlock, { props: { properties: blockOf("QrCode", values).properties } });
  }

  function codeOf(values: Record<string, unknown> = {}) {
    return wrapperOf(values).get(".qr-code-block__code");
  }

  it("draws the stored address at the default size", () => {
    const code = codeOf({ url: me });

    expect(code.html()).toContain("<svg");
    expect(code.html()).toContain('width="160"');
    expect(code.attributes("role")).toBe("img");
  });

  it("draws the page's own address when no link is stored", () => {
    const own = codeOf().html();

    expect(own).toContain("<svg");
    expect(own).not.toBe(codeOf({ url: me }).html());
  });

  it("falls back to the page address for a stored link that is not a string", () => {
    expect(codeOf({ url: 42 }).html()).toBe(codeOf().html());
  });

  it("draws the stored size and colours", () => {
    const html = codeOf({ url: me, size: 320, foreground: "#112233", background: "#ffeeee" }).html();

    expect(html).toContain('width="320"');
    expect(html).toContain("#112233");
    expect(html).toContain("#ffeeee");
  });

  it("keeps the default size and colours for a code stored without them", () => {
    const block = blockOf("QrCode", { url: me });
    delete block.properties.size;
    delete block.properties.foreground;
    delete block.properties.background;

    const html = mount(QrCodeBlock, { props: { properties: block.properties } })
      .get(".qr-code-block__code")
      .html();

    expect(html).toContain('width="160"');
    expect(html).toContain("#171515");
    expect(html).toContain("#ffffff");
  });

  /* The schema offers 80–320, but the API stores block JSON unvalidated, so the render clamps it. */
  it.each([
    [5000, "320"],
    [1, "80"],
  ])("clamps a stored size of %i into the block's range", (size, expected) => {
    expect(codeOf({ url: me, size }).html()).toContain(`width="${expected}"`);
  });

  it("falls back to the default size for a stored size that is not a number", () => {
    const html = codeOf({ url: me, size: '1" onload="alert(1)' }).html();

    expect(html).toContain('width="160"');
    expect(html).not.toContain("onload");
  });

  it("draws the default colours for a stored colour that is not a colour", () => {
    const html = codeOf({ url: me, foreground: "url(https://third-party.example/paint)" }).html();

    expect(html).toContain("#171515");
    expect(html).not.toContain("url(");
    expect(html).not.toContain("href");
  });

  it("draws nothing at all for an address too long to be a code", () => {
    const wrapper = wrapperOf({ url: `https://links.example/${"x".repeat(5000)}` });

    expect(wrapper.find(".qr-code-block").exists()).toBe(false);
    expect(wrapper.find("svg").exists()).toBe(false);
  });

  /* The fragment is the one part of the address only the browser has, so it never reaches the code. */
  it("draws the same code with or without a fragment in the page address", () => {
    window.location.hash = "";
    const plain = codeOf().html();

    window.location.hash = "#links";
    const withFragment = codeOf().html();

    window.location.hash = "";

    expect(withFragment).toBe(plain);
  });

  it("prints the caption below the code and names the figure with it", () => {
    const wrapper = wrapperOf({ url: me, caption: "Scan me" });

    expect(wrapper.get(".qr-code-block__caption").text()).toBe("Scan me");
    expect(wrapper.get(".qr-code-block__code").attributes("aria-label")).toBe("Scan me");
  });

  it("draws no caption line for a caption of only whitespace", () => {
    const wrapper = wrapperOf({ url: me, caption: "   " });

    expect(wrapper.find(".qr-code-block__caption").exists()).toBe(false);
    expect(wrapper.get(".qr-code-block__code").attributes("aria-label")).toBe("QR code");
  });
});

describe("SocialIconsBlock", () => {
  const filled = {
    telegram: "https://t.me/me",
    instagram: "instagram.com/me",
    email: "me@example.com",
  };

  function wrapperOf(values: Record<string, unknown> = {}) {
    return mount(SocialIconsBlock, { props: { properties: blockOf("SocialIcons", values).properties } });
  }

  it("draws only the slots that were filled, in slot order", () => {
    const links = wrapperOf(filled).findAll("a");

    expect(links.map((link) => link.attributes("href"))).toEqual([
      "https://t.me/me",
      "https://instagram.com/me",
      "mailto:me@example.com",
    ]);
  });

  it("opens a web link in a new tab without a referrer", () => {
    const [telegram] = wrapperOf(filled).findAll("a");

    expect(telegram!.attributes("target")).toBe("_blank");
    expect(telegram!.attributes("rel")).toBe("noopener noreferrer");
  });

  it("hands the email over in place, with neither a target nor a referrer", () => {
    const email = wrapperOf(filled).get("a[href^='mailto:']");

    expect(email.attributes("href")).toBe("mailto:me@example.com");
    expect(email.attributes("target")).toBeUndefined();
    expect(email.attributes("rel")).toBeUndefined();
  });

  it("draws the slot's icon and names it for a screen reader", () => {
    const [telegram] = wrapperOf({ telegram: "t.me/me" }).findAll("a");

    expect(telegram!.get(".social-icons-block__icon").classes()).toContain("i-simple-icons:telegram");
    expect(telegram!.attributes("aria-label")).toBe("Telegram");
  });

  it("uses the mail icon for the email slot", () => {
    const email = wrapperOf({ email: "me@example.com" }).get("a[href^='mailto:']");

    expect(email.get(".social-icons-block__icon").classes()).toContain("i-lucide:mail");
  });

  it.each([
    ["every slot empty", {}],
    ["a whitespace-only slot", { telegram: "   " }],
  ])("renders nothing at all for %s", (_case, values) => {
    const wrapper = wrapperOf(values);

    expect(wrapper.find(".social-icons-block").exists()).toBe(false);
    expect(wrapper.findAll("a")).toHaveLength(0);
  });

  it.each([
    ["filled", { "--social-bg": "var(--links-page-accent)", "--social-fg": "#fff", "--social-border": "transparent" }],
    [
      "outline",
      {
        "--social-bg": "transparent",
        "--social-fg": "var(--links-page-accent)",
        "--social-border": "var(--links-page-accent)",
      },
    ],
    [
      "plain",
      { "--social-bg": "transparent", "--social-fg": "var(--links-page-fg)", "--social-border": "transparent" },
    ],
  ])("draws the %s variant", (variant, expected) => {
    const style =
      wrapperOf({ ...filled, variant })
        .get(".social-icons-block")
        .attributes("style") ?? "";

    for (const [token, value] of Object.entries(expected)) expect(style).toContain(`${token}: ${value}`);
  });

  it("draws the filled variant, the 24px icon and the centre alignment when nothing is stored", () => {
    const style = wrapperOf(filled).get(".social-icons-block").attributes("style") ?? "";

    expect(style).toContain("--social-bg: var(--links-page-accent)");
    expect(style).toContain("--social-size: 24px");
    expect(style).toContain("--social-align: center");
  });

  it.each([
    ["", "24px"],
    [5000, "48px"],
  ])("clamps a stored icon size of %s to %s", (size, expected) => {
    const style =
      wrapperOf({ ...filled, size })
        .get(".social-icons-block")
        .attributes("style") ?? "";

    expect(style).toContain(`--social-size: ${expected}`);
  });

  /*
    The slot is a free-text url the API never validates, so a stored `javascript:` value would execute
    in the page's own origin when a visitor clicked the icon.
  */
  it.each([["telegram"], ["email"]])("drops the %s slot when its stored value is a script url", (key) => {
    const wrapper = wrapperOf({ [key]: "javascript:alert(1)" });

    expect(wrapper.find(".social-icons-block").exists()).toBe(false);
    expect(wrapper.html()).not.toContain("javascript:");
  });

  it("takes the icon size and the alignment from the stored properties", () => {
    const style =
      wrapperOf({ ...filled, size: 40, align: "left" })
        .get(".social-icons-block")
        .attributes("style") ?? "";

    expect(style).toContain("--social-size: 40px");
    expect(style).toContain("--social-align: left");
  });

  it("falls back to the defaults for a stored style and alignment outside the palette", () => {
    const style =
      wrapperOf({ ...filled, variant: "square", align: "justify" })
        .get(".social-icons-block")
        .attributes("style") ?? "";

    expect(style).toContain("--social-bg: var(--links-page-accent)");
    expect(style).toContain("--social-align: center");
  });
});

describe("MapBlock", () => {
  const moscow = { address: "Tverskaya 1, Moscow" };

  function wrapperOf(values: Record<string, unknown> = {}) {
    return mount(MapBlock, { props: { properties: blockOf("Map", { ...moscow, ...values }).properties } });
  }

  it("embeds the mapped address lazily, through the keyless endpoint", () => {
    const frame = wrapperOf().get("iframe");

    expect(frame.attributes("src")).toBe("https://maps.google.com/maps?q=Tverskaya%201%2C%20Moscow&z=15&output=embed");
    expect(frame.attributes("loading")).toBe("lazy");
    expect(frame.attributes("title")).toBe("Map");
  });

  it("encodes a cyrillic address into the frame", () => {
    const frame = wrapperOf({ address: "Москва, Красная площадь 1" }).get("iframe");

    expect(frame.attributes("src")).toContain(`q=${encodeURIComponent("Москва, Красная площадь 1")}`);
  });

  it("takes the zoom from the stored property", () => {
    expect(wrapperOf({ zoom: 12 }).get("iframe").attributes("src")).toContain("z=12");
  });

  it.each([
    [240, "240px"],
    [120, "120px"],
    [400, "400px"],
  ])("draws a %ipx height", (height, expected) => {
    expect(wrapperOf({ height }).get(".map-block").attributes("style")).toContain(`--map-height: ${expected}`);
  });

  it.each([
    ["", "240px"],
    [5000, "400px"],
  ])("clamps a stored height of %s to %s", (height, expected) => {
    expect(wrapperOf({ height }).get(".map-block").attributes("style")).toContain(`--map-height: ${expected}`);
  });

  it("keeps the 240px height and the zoom default when none is stored", () => {
    const block = blockOf("Map", moscow);
    delete block.properties.height;
    delete block.properties.zoom;
    const wrapper = mount(MapBlock, { props: { properties: block.properties } });

    expect(wrapper.get(".map-block").attributes("style")).toContain("--map-height: 240px");
    expect(wrapper.get("iframe").attributes("src")).toContain("z=15");
  });

  it("captions the map and names the frame with the same text", () => {
    const wrapper = wrapperOf({ caption: "Our office" });

    expect(wrapper.get(".map-block__caption").text()).toBe("Our office");
    expect(wrapper.get("iframe").attributes("title")).toBe("Our office");
  });

  it("draws no caption line for a caption of only whitespace", () => {
    const wrapper = wrapperOf({ caption: "   " });

    expect(wrapper.find(".map-block__caption").exists()).toBe(false);
    expect(wrapper.get("iframe").attributes("title")).toBe("Map");
  });

  it("opens the same lookup in the full maps page, in a new tab without a referrer", () => {
    const link = wrapperOf().get(".map-block__link");

    expect(link.attributes("href")).toBe("https://www.google.com/maps/search/?api=1&query=Tverskaya%201%2C%20Moscow");
    expect(link.attributes("target")).toBe("_blank");
    expect(link.attributes("rel")).toBe("noopener noreferrer");
    expect(link.text()).toBe("Open in maps");
  });

  it("drops the link when the switch is off", () => {
    expect(wrapperOf({ "show-link": false }).find(".map-block__link").exists()).toBe(false);
    expect(wrapperOf().find(".map-block__link").exists()).toBe(true);
  });

  it.each([
    ["an empty address", ""],
    ["a whitespace address", "   "],
  ])("renders nothing at all for %s", (_case, address) => {
    const wrapper = wrapperOf({ address });

    expect(wrapper.find(".map-block").exists()).toBe(false);
    expect(wrapper.find("iframe").exists()).toBe(false);
  });
});

describe("CountdownBlock", () => {
  /* The block's clock is the wall clock, so every test pins it instead of waiting for real seconds. */
  const target = "2026-12-01T00:00:00.000Z";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-30T23:59:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * The clock starts in `onMounted`, so the first render is the empty one the server sends and the
   * digits only arrive with the render after it.
   */
  async function wrapperOf(values: Record<string, unknown> = {}) {
    const wrapper = mount(CountdownBlock, {
      props: { properties: blockOf("Countdown", { target, ...values }).properties },
    });
    await nextTick();
    return wrapper;
  }

  function valuesOf(wrapper: VueWrapper) {
    return wrapper.findAll(".countdown-block__value").map((value) => value.text());
  }

  it("draws nothing before the clock starts", () => {
    const wrapper = mount(CountdownBlock, { props: { properties: blockOf("Countdown", { target }).properties } });

    expect(wrapper.find(".countdown-block").exists()).toBe(false);
  });

  it("draws all four parts, the days included while they are zero", async () => {
    const wrapper = await wrapperOf();

    expect(valuesOf(wrapper)).toEqual(["00", "00", "01", "00"]);
    expect(wrapper.findAll(".countdown-block__unit-label").map((label) => label.text())).toEqual(["d", "h", "m", "s"]);
  });

  it("counts the seconds down on its own", async () => {
    const wrapper = await wrapperOf();

    vi.advanceTimersByTime(1000);
    await nextTick();

    expect(valuesOf(wrapper)).toEqual(["00", "00", "00", "59"]);
  });

  it("carries a long countdown into the same four parts", async () => {
    vi.setSystemTime(new Date("2026-11-25T21:56:56.000Z"));

    expect(valuesOf(await wrapperOf())).toEqual(["05", "02", "03", "04"]);
  });

  it("reads the whole countdown as one line for a screen reader", async () => {
    expect((await wrapperOf()).get("[role='timer']").attributes("aria-label")).toBe("0d 00:01:00");
  });

  it("renders the stored title above the digits", async () => {
    expect((await wrapperOf({ title: "Launch" })).get(".countdown-block__title").text()).toBe("Launch");
  });

  it("draws no title line for a title of only whitespace", async () => {
    expect((await wrapperOf({ title: "   " })).find(".countdown-block__title").exists()).toBe(false);
  });

  it("swaps the digits for the finished text at the target instant", async () => {
    const wrapper = await wrapperOf();

    vi.setSystemTime(new Date(target));
    vi.advanceTimersByTime(1000);
    await nextTick();

    expect(wrapper.find(".countdown-block__parts").exists()).toBe(false);
    expect(wrapper.get(".countdown-block__finished").text()).toBe("The countdown has finished");
  });

  it("takes the finished text from the stored property", async () => {
    const wrapper = await wrapperOf({ "finished-text": "We are live!" });

    vi.setSystemTime(new Date(target));
    vi.advanceTimersByTime(1000);
    await nextTick();

    expect(wrapper.get(".countdown-block__finished").text()).toBe("We are live!");
  });

  it("draws nothing at all after the finish when the switch is on", async () => {
    const wrapper = await wrapperOf({ "hide-after-finish": true });
    expect(wrapper.find(".countdown-block").exists()).toBe(true);

    vi.setSystemTime(new Date(target));
    vi.advanceTimersByTime(1000);
    await nextTick();

    expect(wrapper.find(".countdown-block").exists()).toBe(false);
  });

  it.each([
    ["box", "countdown-block--box"],
    ["plain", "countdown-block--plain"],
  ])("draws the %s style", async (variant, expected) => {
    expect((await wrapperOf({ variant })).get(".countdown-block").classes()).toContain(expected);
  });

  it("draws the box style when none is stored", async () => {
    expect((await wrapperOf()).get(".countdown-block").classes()).toContain("countdown-block--box");
  });

  it("falls back to the box style for a style outside the palette", async () => {
    expect((await wrapperOf({ variant: "circle" })).get(".countdown-block").classes()).toContain(
      "countdown-block--box",
    );
  });

  /*
    A block nobody has pointed at a date yet has no countdown to draw — unlike a target that has passed
    or cannot be read, which the block reports as finished rather than pretending the block is empty.
  */
  it("draws nothing at all while the block has no target", async () => {
    expect((await wrapperOf({ target: "" })).find(".countdown-block").exists()).toBe(false);
  });

  it("treats a target the parser cannot read as a finished countdown", async () => {
    const wrapper = await wrapperOf({ target: "nonsense" });

    expect(wrapper.find(".countdown-block__parts").exists()).toBe(false);
    expect(wrapper.get(".countdown-block__finished").text()).toBe("The countdown has finished");
  });

  it("draws nothing at all for an unreadable target when the switch is on", async () => {
    expect(
      (await wrapperOf({ "target": "nonsense", "hide-after-finish": true })).find(".countdown-block").exists(),
    ).toBe(false);
  });

  it("stops its clock when the block goes away", async () => {
    const wrapper = await wrapperOf();
    expect(vi.getTimerCount()).toBe(1);

    wrapper.unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
