import { defineConfig, presetIcons, presetTypography, presetUno, presetWebFonts, transformerVariantGroup } from "unocss";
import presetAnimations from "unocss-preset-animations";
import extractorMdc from "@unocss/extractor-mdc";

export default defineConfig({
  theme: {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 4px)",
      sm: "calc(var(--radius) - 2px)",
    },
  },
  shortcuts: {
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
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]s|[jt]sx|md[xc]?|astro|elm|php|phtml|html)($|\?)/,
      ],
    },
  },
});
