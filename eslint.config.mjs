import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

const eslintConfig = defineConfig([
  globalIgnores([
    "build/**",
    ".react-router/**",
    ".next/**",
    "public/**",
    "node_modules/**",
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat["recommended-latest"],
  reactRefresh.configs.vite,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    // React Router route modules intentionally co-locate loaders/meta/etc.
    // with the default component export.
    files: ["app/root.tsx", "app/routes/**/*.tsx"],
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: [
            "meta",
            "links",
            "headers",
            "loader",
            "action",
            "clientLoader",
            "clientAction",
            "shouldRevalidate",
            "handle",
            "ErrorBoundary",
            "HydrateFallback",
            "Layout",
          ],
        },
      ],
    },
  },
  {
    // Test files/helpers run through Vitest, never the Vite dev server's
    // React Refresh pipeline, so the "only export components" constraint
    // doesn't apply.
    files: ["app/test/**", "**/*.test.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
]);

export default eslintConfig;
