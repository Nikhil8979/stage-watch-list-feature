// vitest.config.integration.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/tests/**/*.test.ts"],
    setupFiles: ["src/tests/helpers/setup.ts"],
  },
  //   resolve: {
  //     alias: {
  //       auth: "/src/auth",
  //       quotes: "/src/quotes",
  //       lib: "/src/lib",
  //     },
  //   },
});
