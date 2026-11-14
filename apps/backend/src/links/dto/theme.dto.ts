import type { PageTheme } from "@links/blocks";

import { BACKGROUND_PRESET_IDS, BUTTON_VARIANTS, COLOR_SCHEMES, FONT_PRESETS } from "@links/blocks";
import { IsIn, IsInt, IsNumber, Matches, Max, Min } from "class-validator";

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

/**
 * A whole theme is sent at once: every field is required, so a partial update can never leave a page
 * with a half-applied look whose colours no longer match the background it kept.
 *
 * `toPageTheme` narrows the validated body to the stored shape: `links.theme` holds a plain object,
 * never the DTO instance class-validator decorated.
 */
export class UpdateThemeDto {
  @IsIn(BACKGROUND_PRESET_IDS)
  backgroundPreset!: PageTheme["backgroundPreset"];

  @IsNumber()
  @Min(0)
  @Max(1)
  overlayOpacity!: number;

  @Matches(hexColorPattern)
  accent!: string;

  @Matches(hexColorPattern)
  text!: string;

  @IsIn(FONT_PRESETS)
  fontPreset!: PageTheme["fontPreset"];

  @IsInt()
  @Min(0)
  @Max(40)
  radius!: number;

  @IsIn(BUTTON_VARIANTS)
  buttonVariant!: PageTheme["buttonVariant"];

  @IsIn(COLOR_SCHEMES)
  colorScheme!: PageTheme["colorScheme"];

  toPageTheme(): PageTheme {
    return {
      backgroundPreset: this.backgroundPreset,
      overlayOpacity: this.overlayOpacity,
      accent: this.accent,
      text: this.text,
      fontPreset: this.fontPreset,
      radius: this.radius,
      buttonVariant: this.buttonVariant,
      colorScheme: this.colorScheme,
    };
  }
}
