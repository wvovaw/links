import { defineConfig } from "oxfmt";

export default defineConfig({
  tabWidth: 2,
  printWidth: 120,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  quoteProps: "consistent",
  arrowParens: "always",
  bracketSpacing: true,
  jsxSingleQuote: false,
  sortPackageJson: true,
  sortImports: {
    groups: [
      "type-import",
      ["value-builtin", "value-external"],
      "type-internal",
      "value-internal",
      ["type-parent", "type-sibling", "type-index"],
      ["value-parent", "value-sibling", "value-index"],
      "unknown",
    ],
  },
  ignorePatterns: ["node_modules", "dist", "package-lock.json"],
  overrides: [
    {
      files: ["**/*.json", "**/*.jsonc"],
      options: {
        trailingComma: "none",
      },
    },
  ],
});
