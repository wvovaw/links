import { fileURLToPath } from "node:url";

/**
 * This config extends nuxt.config.ts
 * This file is meant for the project structure settings only
 */
export default defineNuxtConfig({
  alias: {
    "~app": fileURLToPath(new URL("./src/app", import.meta.url)),
    "~pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
    "~widgets": fileURLToPath(new URL("./src/widgets", import.meta.url)),
    "~features": fileURLToPath(new URL("./src/features", import.meta.url)),
    "~entities": fileURLToPath(new URL("./src/entities", import.meta.url)),
    "~shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
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
  srcDir: "./src",
  dir: {
    pages: "app/pages",
    layouts: "app/layouts",
    middleware: "app/middleware",
    plugins: "app/plugins",
    modules: "app/modules",
    assets: "shared/assets",
    public: "shared/public",
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
        path: "shared/ui/global",
        global: true,
      },
    ],
  },
  imports: {
    /* auto-imported composables, utils, etc. */
    dirs: [],
  },
});
