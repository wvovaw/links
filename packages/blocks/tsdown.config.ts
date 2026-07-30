import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/main.ts"],
  sourcemap: false,
  dts: true,
  format: "esm",
  clean: true,
});
