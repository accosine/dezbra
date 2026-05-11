/// <reference types="@vitest/browser/providers/playwright" />

import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      // https://vitest.dev/guide/browser/playwright
      instances: [
        { browser: "chromium" },
        { browser: "firefox" },
        { browser: "webkit" },
      ],
      provider: playwright(),
    },
    coverage: {
      exclude: ["**/*spec*{js,ts,jsx,tsx}", "src/main.ts", "src/constants.ts"],
      include: ["src/**/*.ts"],
      reporter: ["text", "json", "html"],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    exclude: ["**/*spec*{js,ts,jsx,tsx}", "**/node_modules/**", "**/dist/**"],
    include: ["src/**/*test*.{js,ts,jsx,tsx}"],
  },
});
