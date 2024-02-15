<br />
<h1 align="center">Wuxt</h1>

Wuxt is a preconfigured Nuxt 3 setup with a customized file structure. It comes with a list of necessary Nuxt modules installed and configured, promoting colocation instead of the "files by role" Nuxt directory structure.

<details>
  <summary>
    Table of Contents
  </summary>

- [Installed Nuxt modules](#installed-nuxt-modules)
- [Getting started](#getting-started)
- [Directory Structure](#directory-structure)
  - [App Directory](#app-directory)
  - [Colocation](#colocation)
  - [Public API](#public-api)
- [Configurations](#configurations)
  - [Disabled Auto Imports](#disabled-auto-imports)
  - [UnoCSS](#unocss)
  - [i18n](#i18n)
  - [Vitest. Unit tests and component tests](#vitest-unit-tests-and-component-tests)
  - [SEO](#seo)
</details>

## Installed Nuxt modules

- [Nuxt content](https://content.nuxt.dev/) - enabled and ready to use
- [Unocss](https://unocss.dev/) - uno, icons, typography, webfonts, and animation presets enabled
- [Nuxt I18n](https://i18n.nuxtjs.org/) - i18n ready
- [Vueuse](https://vueuse.org/) - Vue Composition API utilities
- [Pinia](https://pinia.vuejs.org/) - Pinia state manager, nothing special
- [Radix-Vue](https://www.radix-vue.com/) - ready to use Radix-Vue
- [Vitest](https://github.com/vitest-dev/vitest) - unit and component tests with @vue/test-utils, @nuxt/test-utils, and @pinia/testing
- [antfu/eslint-config](https://github.com/antfu/eslint-config) - code linting and formatting

## Getting Started

### Github Template

[Create a repo from this template](https://github.com/wvovaw/wuxt/generate)

### Clone and degit

```sh
npx degit wvovaw/wuxt app-name
cd app-name
pnpm i
```

### Checklist

1. Edit `package.json`
2. Rename`.env.example` to `.env.local`, read it
3. Take a look at the example code and built your own following this guidelines

## Directory Structure

- `app` directory for all frontend-related code only.
- `locales` directory for vue-i18n global localizations. Both `app` and `server` layers have access to it.
- `modules`, `public`, `server`, `content` - aren't changed.

### App Directory

The behavior of `pages`, `layouts`, `assets`, `middleware`, `plugins` directories isn't changed. File-based router and plugin autoregistration work as expected.

Wuxt implements some sort of Modular Architecture. Look at the `app` directory to learn more.

`ui`, `components`, `widgets` - simple file structure. It's not a mandatory structure and can be changed. Look at the `alias` option in the `nuxt.structure.ts` and also `eslint.config.js` if you want to change it to your needs.

- `ui` - is for UI kit components only.
- `components` - is for app-wide components and small reusable components that don't have too much business logic. It is also used for Nuxt-content globally registered components under `components/_content` directory.
- `widgets` - is for standalone isolated modules of the app. They can have their business logic, stores, API repositories, lifecycle, etc.

The main rule here is that the "upper" layer can't inherit any parts of the "lower" layers. Like `ui` can't use `components` in it. Eslint can help to keep up with these rules.

### Colocation

Wuxt promotes [colocation](https://kentcdodds.com/blog/colocation).

> Place code as close to where it's relevant as possible

No unit tests in the `app/tests` directory - each module keeps them close to itself.
No stores other than global ones in the `app/stores` directory and so on.

Modules keep all related stuff in their own space and manage which parts are available from the outside by their public interface defined in the `index.ts` entry point file.

### Public API

Public API is an entry point to a module. The module isolates all the implementation in its directory and manages which parts of it are available from the outside.

Here's an example of the correct module structure:

```
> app/widgets/
      > HelloWuxt/
            > api
            > composables
            > stores
            > tests
            WCounter.vue
            index.ts
```
1. There must always be a public interface defined in the `index.ts` of a particular module.
2. The root component of a module has the same filename as the module itself. Don't call it `index.vue` or something else so it will be correctly displayed in Nuxt and Vue devtools.
3. A module has its file structure with components, composables, api, stores, etc. But only `index.ts` manages parts that will be available from the outside of the module.

ESLint configuration restricts imports from within the module. Here is an example of correct and incorrect code.

```diff
- import CalendarOnlyButton from "~widgets/Calendar/components/CButton.vue";

- import Link from "~components/Navigation/components/NLink.vue";
+ import { NavigationLink } from "~components/Navigation";

- import useSomething from "~widgets/SomeWidget/composables/useSomething.ts";
+ import { useSomething } from "~widgets/SomeWidget"
```

Look at the Wuxt `app` directory to learn more. It includes some example widgets for demostration purposes.
Work on this pattern is still in progress.

## Configurations

### Disabled Auto Imports

Auto import is only available for Vue, Nuxt utils, and some Nuxt modules. No components, composables, utils autoimports are available by default. This can be turned on on-demand in the `nuxt.structure.ts` file.

### Unocss

Wuxt unocss configuration adds some minimal set of presets and transformers. It also has an example theme configuration. It's SSR friendly, cooikie based, respects browser settings (prefers-color-scheme) and uses [Vueuse utilities](https://vueuse.org/core/usecolormode/) to achieve this.

Presets and transformers included:

- [presetUno](https://unocss.dev/presets/uno) - the default preset of UnoCSS. It provides TailwindCSS, Bootstrap and Tachyons utilities (mainly required by other presets)
- [presetWebFonts](https://unocss.dev/presets/web-fonts) - install fonts from some popular fonts providers
- [presetIcons](https://unocss.dev/presets/icons) - Use any icon with Pure CSS and iconify
- [presetTypography](https://unocss.dev/presets/typography) - prose classes to render markdown
- [presetAnimations](https://unocss-preset-animations.aelita.me/) - community preset that adds animations utilities
- [transformerVariantGroup](https://unocss.dev/transformers/variant-group) - combineEnables the variant group feature of Windi CSS

No tagify or attributify. If you like it - just install it according to UnoCSS docs.

### i18n

Wuxt is i18n ready. It comes with RU and EN lazy-loaded locales and ready to use `LanguageSwitch` component.

- global translations
- per-component translations with `<i18n>` Vue SFC block
- local translations with `useI18n({ messages })`
- optional [server translations](https://i18n.nuxtjs.org/guide/server-side-translations) with `useTranslation()`

### Vitest. Unit tests and component tests

Use `name.test.ts` naming convention. Keep tests files near the module this test belongs to. For global tests and mocks use the root `app/tests` directory.

### SEO

Optionally install and configure [nuxt-seo module](https://nuxtseo.com/) to deal with comprehensive SEO, open-graph, robots and sitemap generation.
