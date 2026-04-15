// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";
import stylistic from '@stylistic/eslint-plugin'


export default [
  stylistic.configs.recommended,
  {
    plugins: {
      "unused-imports": unusedImports,
      "@stylistic": stylistic,
    },
    rules: {
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      'indent': ['error', 2],
      '@stylistic/indent': ['error', 2],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_",
        },
      ]
    }
  },
  {
    ignores: [
      "node_modules/**",
      "cdk.out/**",
      "build/**",
      "scripts/images/my-react-app/dist/**",
      "scripts/images/my-react-app/dist/node_modules/**",
    ]
  },
  {files: ["**/*.{js,mjs,cjs,ts,tsx}"]},
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      eqeqeq: "off",
      "no-unused-vars": "error",
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];