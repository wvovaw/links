import { defineVitestProject } from "@nuxt/test-utils/config";

export default defineVitestProject({
  plugins: [],
  test: {
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
