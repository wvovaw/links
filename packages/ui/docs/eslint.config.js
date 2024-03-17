import antfu from "@antfu/eslint-config";

export default antfu({
  unocss: true,
  stylistic: {
    indent: 2,
    quotes: "double",
    semi: true,
  },
  javascript: {
    overrides: {
      "no-console": "warn",
    },
  },
});
