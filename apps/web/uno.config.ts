import { defineConfig, presetIcons, presetTypography, presetUno, presetWebFonts, transformerVariantGroup } from "unocss";
import presetAnimations from "unocss-preset-animations";
import transformerDirectives from "@unocss/transformer-directives";
import extractorMdc from "@unocss/extractor-mdc";
import linksUIPreset from "@links/ui/preset";

export default defineConfig({
  theme: {
  },
  shortcuts: {
  },
  presets: [
    presetUno(),
    linksUIPreset(),
    presetIcons({
      collections: {
        "lucide": () => import("@iconify-json/lucide/icons.json").then(i => i.default),
        "vscode-icons": () => import("@iconify-json/vscode-icons/icons.json").then(i => i.default),
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
