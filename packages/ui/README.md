# @links/ui

## Installation

This package is heavily dependent on the Unocss and its presets. This may change in future but it's required now.
Install dependencies and follow the next steps to get the library working.

```sh
pnpm add -D unocss @unocss/reset @unocss/transformer-directives unocss-preset-animations @iconify-json/lucide @iconify-json/vscode-icons radix-vue @vueuse/core cva:class-variance-authority@^7.0.0
```

Your unocss config file must look like this.

```ts:uno.config.ts
import { defineConfig, presetIcons, presetTypography, presetUno, presetWebFonts, transformerVariantGroup } from "unocss";
import presetAnimations from "unocss-preset-animations";
import transformerDirectives from "@unocss/transformer-directives";
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
});
```

Import `@unocss/reset/tailwind.css` and `@ilnks/ui/theme.css`  in the entry point of your app

```ts:main.ts
import "@unocss/reset/tailwind.css";
import "@links/ui/theme.css";
```

Or use the `css` property in `nuxt.config.ts` if usign Nuxt

```ts:nuxt.config.ts
export default defineNuxtConfig({
  css: ["@unocss/reset/tailwind.css", "@links/ui/theme.css"],
});
```

Download fonts. Unzip it inside of the `public/fonts` directory and paste the next code in the global css file of your app

```css:global.css:
@font-face  {
  font-family: 'Averta Std';
  src: url('/fonts/AvertaDemoPE-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face  {
  font-family: 'Averta Bold Italic';
  src: url('/fonts/AvertaDemoPE-ExtraboldItalic.woff2') format('woff2');
  font-weight: bolder;
  font-style: italic;
  font-display: swap;
}
```
