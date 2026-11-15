import { BLOCK_ICONS } from "@links/blocks";
import linksUIPreset from "@links/ui/preset";
import extractorMdc from "@unocss/extractor-mdc";
import transformerDirectives from "@unocss/transformer-directives";
import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerVariantGroup,
} from "unocss";
import presetAnimations from "unocss-preset-animations";

import { SOCIAL_SLOTS } from "./src/shared/blocks/social-icons";

/**
 * The social icons live in the block component rather than in `BLOCK_META`, so the palette's
 * metadata-to-safelist test cannot see them: without this spread every anchor renders an empty box.
 */
const SOCIAL_ICONS = SOCIAL_SLOTS.map((slot) => slot.icon);

export default defineConfig({
  safelist: ["i-lucide:sun-medium", "i-lucide:moon", "i-lucide:monitor", ...BLOCK_ICONS, ...SOCIAL_ICONS],
  theme: {},
  shortcuts: {},
  presets: [
    presetUno(),
    linksUIPreset(),
    presetIcons({
      collections: {
        "lucide": () => import("@iconify-json/lucide/icons.json").then((i) => i.default),
        "simple-icons": () => import("@iconify-json/simple-icons/icons.json").then((i) => i.default),
        "vscode-icons": () => import("@iconify-json/vscode-icons/icons.json").then((i) => i.default),
      },
    }),
    presetWebFonts({
      provider: "google",
      fonts: {
        "dm-sans": [
          {
            name: "DM Sans",
            weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"],
          },
          {
            name: "sans-serif",
            provider: "none",
          },
        ],
      },
    }),
    presetTypography(),
    presetAnimations(),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  /* FXIME: MDC extractor doesn't work  */
  extractors: [extractorMdc()],
  content: {
    filesystem: ["content/**/*.{md,mdc}"],
  },
});
