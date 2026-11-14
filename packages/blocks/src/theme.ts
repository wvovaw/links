/**
 * Page theme: the typed replacement for the client-authored CSS declaration that older pages keep in
 * `links.background`. Every value here is a closed set the API validates against, so the frontend and
 * the backend never disagree about what a theme may contain.
 */

/**
 * Ready-made page backgrounds. The ids are stable and stored on a page, so a preset is never renamed;
 * each value is the CSS declaration the constructor applies to the page.
 */
export const BACKGROUND_PRESETS: Readonly<Record<string, string>> = {
  marine: "background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);",
  sunset: "background: linear-gradient(135deg, #ff7e5f, #feb47b);",
  forest: "background: linear-gradient(135deg, #5a3f37, #2c7744);",
  ocean: "background: linear-gradient(135deg, #2e3192, #1bffff);",
  sunrise: "background: linear-gradient(135deg, #f6d365, #fda085);",
  tropical: "background: linear-gradient(135deg, #a8e063, #56ab2f);",
  lavender: "background: linear-gradient(135deg, #e0c3fc, #8ec5fc);",
  autumn: "background: linear-gradient(135deg, #e43a15, #e65245);",
  mint: "background: linear-gradient(135deg, #00d2ff, #3a7bd5);",
  berry: "background: linear-gradient(135deg, #a83279, #d38312);",
  lime: "background: linear-gradient(135deg, #a1ffce, #faffd1);",
  flamingo: "background: linear-gradient(135deg, #f78ca0, #f9748f);",
  twilight: "background: linear-gradient(135deg, #0f2027, #2c5364);",
  coral: "background: linear-gradient(135deg, #ff9966, #ff5e62);",
  sky: "background: linear-gradient(135deg, #89f7fe, #66a6ff);",
  galaxy: "background: linear-gradient(135deg, #232526, #414345);",
  orchid: "background: linear-gradient(135deg, #da22ff, #9733ee);",
  fire: "background: linear-gradient(135deg, #ff4e50, #f9d423);",
  ice: "background: linear-gradient(135deg, #83a4d4, #b6fbff);",
  magma: "background: linear-gradient(135deg, #f00000, #dc281e);",
  desert: "background: linear-gradient(135deg, #c94b4b, #4b134f);",
};

export const BACKGROUND_PRESET_IDS: readonly string[] = Object.keys(BACKGROUND_PRESETS);

export const FONT_PRESETS = ["dm-sans", "system"] as const;
export type FontPreset = (typeof FONT_PRESETS)[number];

export const BUTTON_VARIANTS = ["solid", "outline", "ghost"] as const;

export const COLOR_SCHEMES = ["light", "dark"] as const;

export interface PageTheme {
  backgroundPreset: string;
  /** How strongly the scrim over the background covers it: 0 leaves the gradient untouched. */
  overlayOpacity: number;
  accent: string;
  text: string;
  fontPreset: FontPreset;
  radius: number;
  buttonVariant: (typeof BUTTON_VARIANTS)[number];
  colorScheme: (typeof COLOR_SCHEMES)[number];
}

export const DEFAULT_PAGE_THEME: PageTheme = {
  backgroundPreset: "marine",
  overlayOpacity: 0.35,
  accent: "#2563eb",
  text: "#171515",
  fontPreset: "dm-sans",
  radius: 12,
  buttonVariant: "solid",
  colorScheme: "light",
};
