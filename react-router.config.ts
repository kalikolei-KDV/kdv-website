import type { Config } from "@react-router/dev/config";

export default {
  // Fully static output: no server, no live preview, no revalidation.
  // Every route is rendered to HTML at build time.
  //
  // TODO: once the `:uid` page route exists, prerender it for every
  // Prismic `page` document too (fetch via `createClient().getAllByType`).
  ssr: false,
  prerender: ["/"],
} satisfies Config;
