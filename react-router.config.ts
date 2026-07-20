import { config as loadEnv } from "dotenv";
import type { Config } from "@react-router/dev/config";

import { createClient } from "./app/prismicio";

// dotenv's default only looks for a plain ".env" file — this repo only has
// ".env.local" (see vite.config.ts for the same note).
loadEnv({ path: ".env.local" });

export default {
  // Fully static output: no server, no live preview, no revalidation.
  // Every route is rendered to HTML at build time.
  ssr: false,
  async prerender() {
    const client = createClient();
    const pages = await client.getAllByType("page").catch(() => []);

    return ["/", ...pages.map((page) => `/${page.uid}`)];
  },
} satisfies Config;
