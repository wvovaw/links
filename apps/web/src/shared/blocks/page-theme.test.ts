import { BACKGROUND_PRESETS, DEFAULT_PAGE_THEME } from "@links/blocks";
import { describe, expect, it } from "vitest";

import { resolvePageStyle } from "./page-theme";

/** A preset is a whole `background` declaration; the page style keeps only its image. */
function presetImage(presetId: string) {
  return BACKGROUND_PRESETS[presetId]!.replace(/^background:\s*/, "").replace(/;\s*$/, "");
}

const legacy = "background-image: linear-gradient(to top, #13b7c6, #a3009c);";

describe("resolvePageStyle", () => {
  it("returns a legacy background string unchanged", () => {
    expect(resolvePageStyle(null, legacy)).toBe(legacy);
  });

  it("maps a theme to background and token variables", () => {
    const style = resolvePageStyle({ ...DEFAULT_PAGE_THEME, accent: "#112233", radius: 4 }, null) as Record<
      string,
      string
    >;

    expect(style["background-image"]).toBe(presetImage(DEFAULT_PAGE_THEME.backgroundPreset));
    expect(style["--links-page-accent"]).toBe("#112233");
    expect(style["--links-page-radius"]).toBe("4px");
  });

  it("falls back instead of throwing on an unknown preset or missing theme", () => {
    const style = resolvePageStyle({ ...DEFAULT_PAGE_THEME, backgroundPreset: "gone" }, null) as Record<string, string>;

    expect(style["background-image"]).toBe(presetImage(DEFAULT_PAGE_THEME.backgroundPreset));
    expect(resolvePageStyle(null, null)).toMatchObject({ "--links-page-accent": DEFAULT_PAGE_THEME.accent });
  });

  it("leaves the button tokens to theme.css when no theme is stored", () => {
    expect(resolvePageStyle(null, null)).not.toHaveProperty("--links-theme-button-bg");
  });

  it("derives the field tokens from the page's text colour", () => {
    const style = resolvePageStyle({ ...DEFAULT_PAGE_THEME, text: "#112233" }, null) as Record<string, string>;

    expect(style["--links-theme-field-fg"]).toBe("#112233");
    expect(style["--links-theme-field-bg"]).toBe("rgba(17, 34, 51, 0.08)");
    expect(style["--links-theme-field-border"]).toBe("rgba(17, 34, 51, 0.28)");
    expect(style["--links-theme-field-placeholder"]).toBe("rgba(17, 34, 51, 0.56)");
  });

  it.each([
    ["light", "#c0242b"],
    ["dark", "#ff9a9a"],
  ] as const)("picks a %s error colour that reads on the page", (colorScheme, expected) => {
    const style = resolvePageStyle({ ...DEFAULT_PAGE_THEME, colorScheme }, null) as Record<string, string>;

    expect(style["--links-theme-error"]).toBe(expected);
  });

  it("leaves the field tokens to theme.css when no theme is stored", () => {
    expect(resolvePageStyle(null, null)).not.toHaveProperty("--links-theme-field-fg");
  });
});

describe.each([
  { variant: "solid", background: "#112233", foreground: "#ffffff", border: "transparent", borderWidth: "0" },
  { variant: "outline", background: "transparent", foreground: "#112233", border: "#112233", borderWidth: "1px" },
  { variant: "ghost", background: "transparent", foreground: "#112233", border: "transparent", borderWidth: "0" },
] as const)("the $variant button variant", ({ variant, background, foreground, border, borderWidth }) => {
  it("derives the button tokens from the accent", () => {
    const style = resolvePageStyle(
      { ...DEFAULT_PAGE_THEME, accent: "#112233", buttonVariant: variant },
      null,
    ) as Record<string, string>;

    expect(style["--links-theme-button-bg"]).toBe(background);
    expect(style["--links-theme-button-fg"]).toBe(foreground);
    expect(style["--links-theme-button-border"]).toBe(border);
    expect(style["--links-theme-button-border-width"]).toBe(borderWidth);
  });
});
