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
});
