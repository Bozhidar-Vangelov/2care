// ESLint flat config for 2Care monorepo (ESLint v9+)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  js.configs.recommended,
  // Type-aware rules (enabled when possible via projectService)
  ...tseslint.configs.recommendedTypeChecked,
  {
    name: "2care/base",
    // Only lint source files under src/ to avoid dist/.d.ts noise
    files: ["**/src/**/*.{ts,tsx,js,jsx}"],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
      "**/.expo/**",
      "**/android/**",
      "**/ios/**",
      "**/.turbo/**",
      "**/*.d.ts" // guard against stray declarations
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser
      },
      parserOptions: {
        // Works well in monorepos without listing all projects
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@typescript-eslint/consistent-type-imports": "warn"
    }
  }
);
