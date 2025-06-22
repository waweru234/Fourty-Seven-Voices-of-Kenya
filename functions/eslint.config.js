import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default [
  eslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        process: "readonly",
        console: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      "object-curly-spacing": ["error", "always"]
    }
  }
]; 