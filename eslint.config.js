import eslintConfig from "./eslint-config/lint-typescript.js";
import { defineConfig } from "eslint/config";
import playwright from "eslint-plugin-playwright";

export default defineConfig([
  {
    files: ["src/**/*.ts", "e2e/**/*.ts"],
    extends: [...eslintConfig],
  },
  {
    files: ["**/*.spec.ts"],
    extends: [playwright.configs["flat/recommended"]],
    rules: {
      // Customize Playwright rules
      // ...
    },
  },
  {
    ignores: ["dist", "**/*.css", "coverage/**/*.*", "dist", "coverage"],
  },
]);
