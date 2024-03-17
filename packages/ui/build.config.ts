import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    { builder: "mkdist", input: "./src/lib", pattern: ["**/*.vue"], loaders: ["vue"] },
    { builder: "mkdist", input: "./src/lib", pattern: ["**/*.ts"], format: "cjs", loaders: ["js"] },
    { builder: "mkdist", input: "./src/lib", pattern: ["**/*.ts"], format: "esm", loaders: ["js"] },
    { builder: "mkdist", input: "./src/lib", pattern: ["**/*.tsx"], format: "esm", loaders: ["js"], esbuild: { jsxFactory: "h" } },
    { builder: "mkdist", input: "./src/lib", pattern: ["**/*.tsx"], format: "cjs", loaders: ["js"], esbuild: { jsxFactory: "h" } },
    { builder: "mkdist", input: "./src/lib", pattern: ["**/*.css"] },
  ],
  declaration: true,
  clean: true,
  externals: [
    "vue",
    "radix-vue",
    "unocss",
    "@unocss/reset",
    "@unocss/transformer-directives",
    "unocss-preset-animations",
    "cva",
    "class-variance-authority",
    "vaul-vue",
    "vee-validate",
    "@vueuse/core",
    "@iconify-json/lucide",
    "@iconify-json/vscode-icons",
  ],
});
