import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  splitting: true,
  sourcemap: false,
  dts: true,
  format: "esm",
  clean: true,
});
