import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

/**
 * Backend tests are compiled by SWC rather than the default esbuild pipeline: NestJS DI reads
 * `design:paramtypes`, which esbuild cannot emit (`emitDecoratorMetadata`). SWC inherits
 * `experimentalDecorators` / `emitDecoratorMetadata` from `tsconfig.json`.
 */
export default defineConfig({
  plugins: [swc.vite()],
  test: {
    environment: "node",
    include: ["src/**/*.spec.ts", "test/**/*.spec.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
