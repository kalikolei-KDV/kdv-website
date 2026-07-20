import "dotenv/config";
import type { Config } from "@react-router/dev/config";

import { createClient } from "./app/prismicio";

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
