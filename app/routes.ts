import { config as loadEnv } from "dotenv";
import { type RouteConfig, index, route } from "@react-router/dev/routes";

import { createClient } from "./prismicio";

// dotenv's default only looks for a plain ".env" file — this repo only has
// ".env.local" (see vite.config.ts for the same note).
loadEnv({ path: ".env.local" });

// In `ssr: false` mode, a route with a `loader` must always be covered by at
// least one prerendered path — there's no server left to run it for
// anything else. Only register a dynamic route once there's at least one
// matching Prismic document for it to prerender.
const client = createClient();
const [pages, caseStudies] = await Promise.all([
  client.getAllByType("page").catch(() => []),
  client.getAllByType("case_study").catch(() => []),
]);

export default [
  index("routes/home.tsx"),
  ...(pages.length > 0 ? [route(":uid", "routes/page.tsx")] : []),
  ...(caseStudies.length > 0
    ? [route("case-studies/:uid", "routes/case-study.tsx")]
    : []),
] satisfies RouteConfig;
