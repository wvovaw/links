import type { PageTheme } from "@links/blocks";

import { BACKGROUND_PRESETS, BACKGROUND_PRESET_IDS, DEFAULT_PAGE_THEME } from "@links/blocks";

/**
 * The style a page root carries.
 *
 * A page published before themes existed keeps its raw CSS declaration byte for byte, which is the
 * whole of its background. A themed page gets the preset gradient plus the custom properties its
 * blocks read. An unknown preset falls back to the default theme instead of leaving the page with
 * no background at all.
 */
export function resolvePageStyle(
  theme: PageTheme | null,
  legacyBackground: string | null,
): Record<string, string> | string {
  if (!theme) return legacyBackground ?? themeStyle(DEFAULT_PAGE_THEME);

  return themeStyle(theme);
}

function themeStyle(theme: PageTheme): Record<string, string> {
  const presetId = BACKGROUND_PRESET_IDS.includes(theme.backgroundPreset)
    ? theme.backgroundPreset
    : DEFAULT_PAGE_THEME.backgroundPreset;
  /* Presets are whole `background` declarations; only the image belongs in `background-image`,
     which also keeps the preset from overriding the page's other background properties. */
  const backgroundImage = (BACKGROUND_PRESETS[presetId] ?? "").replace(/^background:\s*/, "").replace(/;\s*$/, "");

  return {
    "background-image": backgroundImage,
    "color-scheme": theme.colorScheme,
    "--links-font": fontStack(theme.fontPreset),
    "--links-page-accent": theme.accent,
    "--links-page-fg": theme.text,
    "--links-page-overlay": overlayColor(theme.accent, theme.overlayOpacity),
    "--links-page-radius": `${theme.radius}px`,
  };
}

function fontStack(preset: PageTheme["fontPreset"]): string {
  const systemStack = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';

  return preset === "system" ? systemStack : `var(--dm-sans, "DM Sans"), ${systemStack}`;
}

/** The scrim over the background: the accent at the chosen strength, so one colour drives both. */
function overlayColor(accent: string, opacity: number): string {
  const red = Number.parseInt(accent.slice(1, 3), 16);
  const green = Number.parseInt(accent.slice(3, 5), 16);
  const blue = Number.parseInt(accent.slice(5, 7), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}
