import antfu from "@antfu/eslint-config";
import oxlintPlugin from "eslint-plugin-oxlint";

export default antfu({
  plugins: [oxlintPlugin.configs["flat/recommended"]],
  ignores: ["**/eslint.config.js", "src/shared/public/**/*"],
  unocss: true,
  stylistic: {
    indent: 2,
    quotes: "double",
    semi: true,
    overrides: {
      "style/max-statements-per-line": ["off"],
    },
  },
  vue: {
    overrides: {
      "vue/define-macros-order": "off",
    },
  },
  javascript: {
    overrides: {
      "no-console": ["warn"],
      "import/no-cycle": "error",
    },
  },
});
