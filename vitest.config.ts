// vitest.config.integration.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/tests/**/*.test.ts"],
    exclude: ["dist", "node_modules"],
    // Run tests sequentially to avoid database conflicts
    fileParallelism: false,
    maxConcurrency: 1,
  },
});
