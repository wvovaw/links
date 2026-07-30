import baseConfig from "codestyle/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [baseConfig],
  rules: {
    "typescript/no-extraneous-class": ["warn", { allowWithDecorator: true }],
    "import/no-unassigned-import": "off",
  },
  ignorePatterns: ["node_modules", "dist"],
});
