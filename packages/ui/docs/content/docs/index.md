---
title: Getting started
description: links/ui UI library documentation index page
---

# @links/ui

This is a **@links/ui** UI library documentation. It's WIP now and it is the part of the **Links**, the app I'm working on now.

## Installation

This package is heavily dependent on the Unocss and its presets, transformers etc. This may change in future, but it's required now.
Install dependencies and follow the next steps to get the library working.

::ui-docs-code-block{lang="shell"}
```sh
pnpm add -D unocss @unocss/reset @unocss/transformer-directives unocss-preset-animations @iconify-json/lucide @iconify-json/vscode-icons radix-vue @vueuse/core cva:class-variance-authority@^7.0.0
```
::

Your unocss config file must look like this.

::ui-docs-code-block{lang="ts" filename="uno.config.ts"}
```ts
import { defineConfig, presetIcons, presetUno, presetWebFonts, transformerVariantGroup } from "unocss";
import presetAnimations from "unocss-preset-animations";
import transformerDirectives from "@unocss/transformer-directives";
import linksUIPreset from "@links/ui/preset";

export default defineConfig({
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
    presetAnimations(),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
```
::

Import `@unocss/reset/tailwind.css` and `@ilnks/ui/theme.css`  in the entry point of your app

::ui-docs-code-block{lang="ts" filename="main.ts"}
```ts
import "@unocss/reset/tailwind.css";
import "@links/ui/theme.css";
```
::

Or use the `css` property in `nuxt.config.ts`, if using Nuxt

::ui-docs-code-block{lang="ts" filename="nuxt.config.ts"}
```ts
export default defineNuxtConfig({
  css: ["@unocss/reset/tailwind.css", "@links/ui/theme.css"],
});
```
::

Download [Averta PE font](https://www.fonts.uprock.ru/fonts/averta). Unzip it under `public/fonts` directory and paste the next code in the global css file of your app

::ui-docs-code-block{lang="css" filename="global.css"}
```css
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
