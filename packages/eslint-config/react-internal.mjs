import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import imprt from "eslint-plugin-import";
import onlyWarn from "eslint-plugin-only-warn";
import turbo from "eslint-plugin-turbo";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/.*.js", "**/node_modules/", "**/dist/"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      "only-warn": onlyWarn,
      import: imprt,
      turbo,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        React: true,
        JSX: true,
      },
    },

    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },

    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "warn",
        {
          allowShortCircuit: false,
          allowTernary: false,
        },
      ],
    },
  },
  {
    files: ["**/*.js?(x)", "**/*.ts?(x)"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],

    rules: {
      "no-undef": "off",
    },
  },
  eslintConfigPrettier
);
