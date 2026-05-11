// @ts-check
import {
  overrideRulesEslint,
  overrideRulesTsdoc,
  overrideRulesTslint,
  overrideRulesUnicorn,
} from "./rules.js";
import eslint from "@eslint/js";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tsdoc from "eslint-plugin-tsdoc";
import tseslint from "typescript-eslint";

const typescriptFiles = { files: ["**/*.ts"] };

const rules = {
  eslint: {
    rules: { ...eslint.configs.all.rules, ...overrideRulesEslint },
  },
  tsdoc: {
    rules: {
      // Special case, existing rules need no destructuring because they will not be overridden
      ...overrideRulesTsdoc,
    },
  },
  tseslint: {
    rules: {
      // Special case, existing rules need no destructuring because they will not be overridden
      ...overrideRulesTslint,
    },
  },
  unicorn: {
    rules: {
      ...eslintPluginUnicorn.configs.all.rules,
      ...overrideRulesUnicorn,
    },
  },
};

const unicornTypescriptConfig = {
  ...typescriptFiles,
  ...eslintPluginUnicorn.configs.all,
  ...rules.unicorn,
};

const eslintTypescriptConfig = {
  ...typescriptFiles,
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.serviceworker,
      ...globals.browser,
    },
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: true,
    },
  },
  ...eslint.configs.recommended,
  ...rules.eslint,
};

const tslintTypescriptConfig = {
  ...typescriptFiles,
  extends: [tseslint.configs.recommended],
  ...rules.tseslint,
};

const tsdocTypescriptConfig = {
  ...typescriptFiles,
  plugins: {
    tsdoc,
  },
  ...rules.tsdoc,
};

const typescriptConfig = tseslint.config(
  // General
  // @ts-ignore
  eslintTypescriptConfig,
  // Unicorn
  // @ts-ignore
  unicornTypescriptConfig,
  // Typescript
  tslintTypescriptConfig,
  // TSDoc
  tsdocTypescriptConfig,
);

export default typescriptConfig;
