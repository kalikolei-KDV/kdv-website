import { config as loadEnv } from "dotenv";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Vite loads .env.local itself for import.meta.env, but config files and
// loaders that read process.env directly (react-router.config.ts,
// app/routes.ts, app/prismicio.ts) need it loaded explicitly — dotenv's own
// default only looks for a plain ".env" file, which doesn't exist here.
loadEnv({ path: ".env.local" });

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
