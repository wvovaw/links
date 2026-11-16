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

  /* The button and field tokens belong to a stored theme alone: a page without one keeps the
     defaults in `theme.css`, which is the look it had before the theme control existed. */
  return { ...themeStyle(theme), ...buttonTokens(theme), ...fieldTokens(theme) };
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

/**
 * The page-wide button look. A block's own colours still win over these, and `outline` is the only
 * variant that draws a border, so its width travels with the colour.
 */
function buttonTokens(theme: PageTheme): Record<string, string> {
  const filled = theme.buttonVariant === "solid";
  const outlined = theme.buttonVariant === "outline";

  return {
    "--links-theme-button-bg": filled ? theme.accent : "transparent",
    "--links-theme-button-fg": filled ? "#ffffff" : theme.accent,
    "--links-theme-button-border": outlined ? theme.accent : "transparent",
    "--links-theme-button-border-width": outlined ? "1px" : "0",
  };
}

/**
 * The form fields read on any preset: a wash of the page's text colour over its background, with the
 * accent for focus and a red that flips with the page's scheme.
 */
function fieldTokens(theme: PageTheme): Record<string, string> {
  return {
    "--links-theme-field-fg": theme.text,
    "--links-theme-field-bg": withAlpha(theme.text, 0.08),
    "--links-theme-field-border": withAlpha(theme.text, 0.28),
    "--links-theme-field-placeholder": withAlpha(theme.text, 0.56),
    "--links-theme-error": theme.colorScheme === "dark" ? "#ff9a9a" : "#c0242b",
  };
}

function fontStack(preset: PageTheme["fontPreset"]): string {
  const systemStack = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';

  return preset === "system" ? systemStack : `var(--dm-sans, "DM Sans"), ${systemStack}`;
}

/** The scrim over the background: the accent at the chosen strength, so one colour drives both. */
function overlayColor(accent: string, opacity: number): string {
  return withAlpha(accent, opacity);
}

/** A stored theme colour is a `#rrggbb` the API validated, so its channels are always six hex digits. */
function withAlpha(color: string, opacity: number): string {
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}
