import { defineConfig, presetIcons, presetTypography, presetUno, presetWebFonts, transformerVariantGroup } from "unocss";
import presetAnimations from "unocss-preset-animations";
import transformerDirectives from "@unocss/transformer-directives";
import extractorMdc from "@unocss/extractor-mdc";
import presetMoonDS from "./uno.preset-moon";

export default defineConfig({
  theme: {
  },
  shortcuts: {
  },
  presets: [
    presetUno(),
    presetMoonDS(),
    presetIcons({}),
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
