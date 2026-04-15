// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";
import stylistic from "@stylistic/eslint-plugin";

export default [

  // Base JS recommended
  pluginJs.configs.recommended,

  // TypeScript recommended
  ...tseslint.configs.recommended, {
    plugins: {
      "unused-imports": unusedImports,
      "@stylistic": stylistic,
    },

    languageOptions: {
      globals: globals.browser,
    },

    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": ["warn", {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      }],

      "indent": "off",
      "@stylistic/indent": ["warn", 2],
      "@stylistic/array-bracket-newline": ["warn", "never"],
      "@stylistic/array-bracket-spacing": ["warn", "never"],
      "@stylistic/array-element-newline": ["warn", "never"],
      "@stylistic/function-call-argument-newline": ["warn", "never"],
      "@stylistic/function-paren-newline": ["warn", "never"],
      "@stylistic/quotes": ["warn", "double"],
      "@stylistic/no-extra-semi": "error",
      "@stylistic/jsx-pascal-case": "warn",
      "@stylistic/semi": ["warn", "always"],
      "@stylistic/semi-style": ["warn", "last"],

      eqeqeq: "off",
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
    },
  }, {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  }, {
    ignores: ["node_modules/**", "cdk.out/**", "build/**", "scripts/images/my-react-app/dist/**",],
  },];