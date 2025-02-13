// @ts-check

import eslintPlugin from "@typescript-eslint/eslint-plugin"
import eslintParser from "@typescript-eslint/parser"

export default [
  {
    files: ["**/*.ts"],
    ignores: ["shared/cucumber-steps/dist/when-steps.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: eslintParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        console: "readonly",
        module: "readonly",
        process: "readonly",
      },
    },
    plugins: { "@typescript-eslint": eslintPlugin },
    rules: {
      ...eslintPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["examples/custom-action-commonjs/text-run/hello-world.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        module: "readonly",
        process: "readonly",
      },
    },
  },
]
