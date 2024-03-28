import { fileURLToPath } from "node:url";

/**
 * This config extends nuxt.config.ts
 * This file is meant for the project structure settings only
 */
export default defineNuxtConfig({
  alias: {
    "~components": fileURLToPath(new URL("./app/components", import.meta.url)),
    "~widgets": fileURLToPath(new URL("./app/widgets", import.meta.url)),
    "~composables": fileURLToPath(new URL("./app/composables", import.meta.url)),
    "~stores": fileURLToPath(new URL("./app/stores", import.meta.url)),
    "~utils": fileURLToPath(new URL("./app/utils", import.meta.url)),
    "~assets": fileURLToPath(new URL("./app/assets", import.meta.url)),
    "~core": fileURLToPath(new URL("core", import.meta.url)),
  },
  content: {
    // sources: {
    //   content: {
    //     driver: "fs",
    //     prefix: "/docs",
    //     base: resolve(__dirname, "content/docs"),
    //     name: "docs"
    //   },
    // },
  },
  dir: {
    pages: "app/pages",
    layouts: "app/layouts",
    assets: "app/assets",
    middleware: "app/middleware",
    plugins: "app/plugins",
    modules: "modules",
    public: "public",
  },
  pinia: {
    /* auto-imported pinia stores */
    storesDirs: [],
  },
  i18n: {
    vueI18n: "./i18n.config.ts",
  },
  components: {
    /* auto-imported vue components */
    dirs: [
      {
        /* Global Vue components available in nuxt-content MDC */
        path: "app/components/global",
        global: true,
      },
    ],
  },
  imports: {
    /* auto-imported composables, utils, etc. */
    dirs: [],
  },
});
