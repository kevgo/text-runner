// @ts-check

import eslintPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import simpleImportSort from "eslint-plugin-simple-import-sort"

export default [
  {
    files: ["**/*.ts"],
    ignores: ["**/node_modules/", ".git/", "**/dist/**", "shared/cucumber-steps/dist/"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        console: "readonly",
        module: "readonly",
        process: "readonly",
      },
    },
    plugins: { "@typescript-eslint": eslintPlugin, "simple-import-sort": simpleImportSort },
    rules: {
      ...eslintPlugin.configs.recommended.rules,
      "no-var": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-implied-eval": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
  // {
  //   files: ["examples/custom-action-commonjs/text-run/hello-world.js"],
  //   languageOptions: {
  //     ecmaVersion: 2021,
  //     sourceType: "commonjs",
  //     globals: {
  //       console: "readonly",
  //       module: "readonly",
  //       process: "readonly",
  //     },
  //   },
  // },
]
