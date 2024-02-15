Wuxt - an opinionated Nuxt 3 setup
==================================

This template goals is:

1.  Make Nuxt less magical by turning off the auto-import feature for components, composables, and other code written by the application developer.
2.  Separate frontend and server by moving all frontend-only code to the `app` directory, similar to the `server` directory. Shared dirs stays in the root dir. Follow [this](https://github.com/Nuxt/Nuxt/discussions/20251#discussion-5082086) Nuxt proposal.
3.  Make it possible to organize the code not by it's role (composables, components, etc.) but as standalone modules (and using pretty much any other pattern) with [public api](https://feature-sliced.design/docs/reference/public-api).
4.  Preconfigure some base Nuxt modules:
    * **Nuxt content** for docs, blogs, whatever else ready.
    * **Unocss** with all the needed presets and transformers.
    * **Pinia** for client side states management.
    * SSR friendly cookie based theme switching with **vueuse**.
    * I18n for both app and server layer with **Nuxt/i18n**.
    * Unit testing with **vitest**, **@vue/test-utils**, **@nuxt/test-utils**.
    * Linting and code formating with **Antfu ESLint config.**

Why
---

Developing medium-to-big apps with the base Nuxt file structure is okay. _**BUT**_

**Every component you create becomes globally available**, and there's no option to build a module (without using the native Nuxt modules feature) that isolates its own components, composables, etc., which are created solely for the module's purposes. For example, you might want to create a `<Calendar />` module that includes a `<CalendarButton />` component, but you don't want this component to be available for use throughout the entire app. The Nuxt components auto-import feature won't allow you to do this unless you turn it off. Therefore, this template has it disabled. Instead of relying on Nuxt's magic, **you're responsible for organizing the project's code** using [public interfaces](https://feature-sliced.design/docs/reference/public-api). Read about [colocation](https://kentcdodds.com/blog/colocation) in Kent C. Dodds blog.

The base Nuxt directory structure pushes developers to [**group code by its role**](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md). Components, composables, utils, stores - everything has to be suited in its role-defined directory to be available throughout the app. This is considered a bad practice! Disabling auto-imports for all this developer-written code **encourages you to organize your codebase**. This allows you to implement a wide variety of patterns, from modular architecture to clean architecture.

**Configuring modules from the ground up every time is tedious**. Nuxt modules and the Nuxt config don't change that much, so there's **no need to go through their documentation every time to achieve the same result** when starting a new project.

### Q: Nuxt file-based vue-router routes and nitro routes?

A: They remain unchanged and behave as expected.

### Q: What about Nuxt plugins, modules, middlewares?

A: Nuxt client and server plugins, middlewares, and modules are unchanged and behave as expected in Nuxt.

Auto registration works as expected. However, please note that the server and app have their own plugins and middlewares. `app/plugins` registers Vue plugins, and `server/plugins` registers Nitro plugins. The same applies to middlewares - `app/middleware` for all client-side navigation (file-based routes defined in `app/pages`), but `server/middleware` for `server/{api,routes}`.

### Q: I need "X" autoimports

A: There's still an option to turn it on in `nuxt.structure.ts`:

* Fill in components paths in the `components.dirs` array.
* Fill in utils, composables paths in the `imports.dirs` array.
* To autoimport Pinia stores fill the `pinia.storesDirs` array.

But keep in mind, that Nuxt only scans files at the top level of the directory you provide in `imports.dirs` (composables, utils).

[Read more about directory based auto-imports.](https://nuxt.com/docs/guide/concepts/auto-imports#directory-based-auto-imports)
