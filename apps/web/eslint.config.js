import antfu from "@antfu/eslint-config";

export default antfu({
  unocss: true,
  stylistic: {
    indent: 2,
    quotes: "double",
    semi: true,
  },
  vue: {
    overrides: {
      "vue/define-macros-order": "off",
    },
  },
  javascript: {
    overrides: {
      "no-console": ["off"],
      "no-restricted-imports": [
        "error",
        {
          // TODO: add the rule for server alias too
          patterns: [
            {
              group: [
                "@/app/*",
                "~/app/*",
              ],
              message: "Don't use @/app or ~/app import alias. Use ~ prefixed predefined aliases instead (exmple: ~components)",
            },
            {
              group: [
                "~components/*/*",
                "~widgets/*/*",
              ],
              message: "Only imports through the module's public api is allowed. (example: ~components/NavBar) ",
            },
          ],
        },
      ],
      // TODO: make this work
      "import/no-restricted-paths": ["error", {
        basePath: ".",
        zones: [
          {
            target: "./server/*",
            from: ["./app/*", "@/app/*"],
            message: "No imports allowed from the app layer",
          },
          {
            target: ["./app/*"],
            from: ["./server/*", "@/server/*"],
            message: "No imports allowed from the server layer",
          },
        ],
      }],
      "import/no-cycle": "error",
    },
  },
});
