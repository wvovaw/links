import { fileURLToPath } from "node:url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/content",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
  ],
  css: ["@unocss/reset/tailwind.css", "@/assets/css/global.css", "@/assets/css/shiki.css", "../src/lib/css/theme.css"],
  alias: {
    "@lib": fileURLToPath(new URL("../src/lib", import.meta.url)),
    "~ui": fileURLToPath(new URL("../src/lib/components", import.meta.url)),
  },
  ssr: false,
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
      langs: ["vue", "vue-html", "javascript", "typescript", "css", "sh", "shell"],
    },
    experimental: {
      clientDB: true
    }
  },
  nitro: {
    prerender: {
      routes: ["/docs"]
    }
  },
  devtools: { enabled: false },
});
