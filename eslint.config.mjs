import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ],

    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },

    rules: {
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/explicit-function-return-type": "off",
    },

    ignorePatterns: ["dist/", "node_modules/"],
  },
]);
