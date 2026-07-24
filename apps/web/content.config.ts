import { defineContentConfig, defineCollection } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "docs/**",
    }),
    articles: defineCollection({
      type: "page",
      source: "_articles/**",
    }),
  },
});
