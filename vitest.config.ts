import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Separate from vite.config.ts: the `@react-router/dev/vite` plugin drives
// route-manifest generation and SSR-oriented build steps that Vitest's
// transform pipeline doesn't need and isn't set up to satisfy. Plain
// `@vitejs/plugin-react` is enough for component tests.
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./app/test/setup.ts"],
    css: false,
  },
});
