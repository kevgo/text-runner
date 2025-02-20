// @ts-check

import tslintPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import sortKeys from "eslint-plugin-typescript-sort-keys"

export default [
  {
    files: ["**/*.ts"],
    ignores: ["**/node_modules/", ".git/", "dist/", "**/dist/**"],
    languageOptions: {
      ecmaVersion: "latest",
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
    plugins: {
      "@typescript-eslint": tslintPlugin,
      "simple-import-sort": simpleImportSort,
      "typescript-sort-keys": sortKeys,
    },
    rules: {
      ...tslintPlugin.configs.recommended.rules,
      "no-empty-function": "error",
      "prefer-const": [
        "error",
        {
          destructuring: "any",
          ignoreReadBeforeAssign: false,
        },
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "typescript-sort-keys/interface": "error",
      "typescript-sort-keys/string-enum": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-implied-eval": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off", // TODO: enable?
      "@typescript-eslint/no-unsafe-call": "error",
    },
  },
]
