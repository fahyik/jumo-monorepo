import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import imprt from "eslint-plugin-import";
import turbo from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["build/", "**/*.js", "**/*.config.ts", "**/*.config.js"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      import: imprt,
      turbo,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "import/no-cycle": "error",
      "no-unsafe-optional-chaining": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-expressions": [
        "warn",
        {
          allowShortCircuit: false,
          allowTernary: false,
        },
      ],
      eqeqeq: ["error"],
    },
  },
  eslintConfigPrettier
);
