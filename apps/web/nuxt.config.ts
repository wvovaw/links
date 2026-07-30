import { fileURLToPath } from "node:url";

/* Please, read .env.example to learn how to work with environment variables */
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      backendUrl: "",
      baseUrl: "",
    },
  },
  unocss: {
    preflight: true,
  },
  css: ["@links/ui/theme.css", "~/styles/global.css", "~/styles/shiki.css"],
  content: {
    build: {
      markdown: {
        remarkPlugins: {},
        highlight: {
          theme: {
            default: "light-plus",
            dark: "dark-plus",
          },
          langs: ["vue", "vue-html", "javascript", "typescript", "css"],
        },
      },
    },
  },
  image: {},
  i18n: {
    baseUrl: "http://localhost:3000",
    langDir: "../src/shared/locales",
    locales: [
      {
        code: "en",
        language: "en-US",
        name: "English",
        file: "en-US.ts",
        isCatchallLocale: true,
      },
      {
        code: "ru",
        language: "ru-RU",
        name: "Русский",
        file: "ru-RU.ts",
      },
    ],
    defaultLocale: "en",
    strategy: "prefix_and_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    experimental: {
      localeDetector: "../server/utils/i18n.localeDetector.ts",
    },
  },
  routeRules: {
    "/docs/**": { prerender: true },
    // "/links/**": { ssr: false },
    // "/sign-in": { ssr: false },
    // "/sign-up": { ssr: false },
    // "/account/**": { ssr: false },
    // "/preview/**": { ssr: false },
    "/*": { ssr: true },
  },
  modules: ["@unocss/nuxt", "@nuxtjs/i18n", "@nuxt/content", "@vueuse/nuxt", "@nuxt/image", "@pinia/nuxt"],
  experimental: {
    typedPages: true,
  },
  devtools: { enabled: false },
  telemetry: false,
  typescript: {
    tsConfig: {
      include: ["../src/**/*"],
    },
    sharedTsConfig: {
      include: ["../src/**/*"],
    },
    nodeTsConfig: {
      include: ["../src/**/*"],
    },
  },
  dir: {
    assets: "../src/shared/assets",
    public: "../src/shared/public",
  },
  pinia: {
    storesDirs: [],
  },
  components: {
    dirs: [
      {
        path: "../src/shared/ui/global",
        global: true,
      },
    ],
  },
  imports: {
    dirs: [],
  },
  alias: {
    "~pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
    "~widgets": fileURLToPath(new URL("./src/widgets", import.meta.url)),
    "~features": fileURLToPath(new URL("./src/features", import.meta.url)),
    "~entities": fileURLToPath(new URL("./src/entities", import.meta.url)),
    "~shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
  },
  watch: ["uno.config.ts"],
  compatibilityDate: "2026-07-24",
});
