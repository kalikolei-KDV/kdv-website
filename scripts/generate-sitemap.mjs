#!/usr/bin/env node
// Generates public/sitemap.xml from the same live Prismic content that
// react-router.config.ts's `prerender()` uses to decide which paths get
// built — run automatically before every `npm run build` so the sitemap
// never drifts from what's actually deployed. Written to public/ (not
// build/client/ directly) so Vite's static-asset copy picks it up as part
// of the build it's chained in front of.

import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as prismic from "@prismicio/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const SITE_URL = process.env.SITE_URL || "https://kingsmendv.com";

// dotenv's default only looks for a plain ".env" file — this repo only has
// ".env.local" (see vite.config.ts for the same note).
loadEnv({ path: path.join(rootDir, ".env.local") });

const sm = JSON.parse(
  fs.readFileSync(path.join(rootDir, "slicemachine.config.json"), "utf8"),
);
const repositoryName = process.env.PRISMIC_ENVIRONMENT || sm.repositoryName;

const client = prismic.createClient(repositoryName, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});

function urlEntry(loc) {
  return `  <url><loc>${SITE_URL}${loc}</loc></url>`;
}

async function main() {
  const [pages, caseStudies] = await Promise.all([
    client.getAllByType("page").catch(() => []),
    client.getAllByType("case_study").catch(() => []),
  ]);

  const entries = [
    urlEntry("/"),
    ...pages.map((page) => urlEntry(`/${page.uid}`)),
    ...caseStudies.map((caseStudy) =>
      urlEntry(`/case-studies/${caseStudy.uid}`),
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

  fs.writeFileSync(path.join(rootDir, "public", "sitemap.xml"), xml);
  console.log(`Wrote public/sitemap.xml (${entries.length} URLs).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
