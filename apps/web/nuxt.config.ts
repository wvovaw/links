export default defineNuxtConfig({
  /* Please, read .env.example to learn how to work with environment variables */
  runtimeConfig: {
    /* server-side only keys goes here */
    mySecretVar: "",
    public: {
      /* public keys is also client-side */
      myPublicVar: "",
    },
  },
  unocss: {
    preflight: true,
  },
  css: ["@links/ui/theme.css", "~assets/css/global.css", "~assets/css/shiki.css"],
  content: {
    markdown: {
      remarkPlugins: {},
      rehypePlugins: [],
    },
    highlight: {
      theme: {
        default: "light-plus",
        dark: "dark-plus",
      },
      langs: ["vue", "vue-html", "javascript", "typescript", "css"],
    },
  },
  image: {
  },
  i18n: {
    lazy: true,
    langDir: "locales",
    locales: [{
      code: "en",
      iso: "en-US",
      name: "English",
      file: "en-US.ts",
      isCatchallLocale: true,
    }, {
      code: "ru",
      iso: "ru-RU",
      name: "Русский",
      file: "ru-RU.ts",
    }],
    defaultLocale: "en",
    strategy: "prefix_and_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    experimental: {
      localeDetector: "./server/utils/i18n.localeDetector.ts",
    },
  },
  routeRules: {
    "/docs/**": { prerender: true },
  },
  modules: [
    "@unocss/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/content",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
  ],
  experimental: {
    typedPages: true,
  },
  devtools: { enabled: false },
  extends: ["nuxt.structure.ts"],
  watch: ["nuxt.structure.ts", "uno.config.ts"],
});
