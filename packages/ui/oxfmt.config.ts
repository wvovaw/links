import baseConfig from "codestyle/oxfmt";
import { defineConfig } from "oxfmt";

export default defineConfig({
  ...baseConfig,
  ignorePatterns: ["node_modules", "dist", "docs/components/global/ui-docs/**/*.vue"],
});
