import baseConfig from "codestyle/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [baseConfig],
  rules: {
    "no-console": "warn",
  },
  ignorePatterns: ["node_modules", "dist", ".nuxt", ".output", "shared/public"],
});
