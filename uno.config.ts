import { defineConfig, presetIcons, presetTypography, presetUno, presetWebFonts, transformerVariantGroup } from "unocss";
import presetAnimations from "unocss-preset-animations";
import extractorMdc from "@unocss/extractor-mdc";

export default defineConfig({
  theme: {
    colors: {
      "fg": "hsl(var(--p-fg), %alpha)",
      "bg": "hsl(var(--p-bg), %alpha)",
      "primary": "hsl(var(--p-primary), %alpha)",
      "secondary": "hsl(var(--p-secondary), %alpha)",
      "accent": "hsl(var(--p-accent), %alpha)",
      "primary-contrast": "hsl(var(--p-primary-contrast), %alpha)",
      "secondary-contrast": "hsl(var(--p-secondary-contrast), %alpha)",
      "accent-contrast": "hsl(var(--p-accent-contrast), %alpha)",
    },
  },
  shortcuts: {
    spoiler: "bg-fg/30 text-transparent hover:(bg-transparent text-fg)",
  },
  presets: [
    presetUno(),
    presetIcons({}),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: [
          {
            name: "Source sans",
            weights: ["200", "300", "400", "500", "600", "700", "800", "900"],
            italic: true,
          },
          {
            name: "sans-serif",
            provider: "none",
          },
        ],
        headings: [
          {
            name: "Montserrat",
            weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
            italic: true,
          },
        ],
        mono: "Monospace",
      },
    }),
    presetTypography(),
    presetAnimations(),
  ],
  transformers: [transformerVariantGroup()],
  /* FXIME: MDC extractor doesn't work  */
  extractors: [extractorMdc()],
  content: {
    filesystem: ["content/**/*.{md,mdc}"],
  },
});
