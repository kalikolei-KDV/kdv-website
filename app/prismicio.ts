import * as prismic from "@prismicio/client";
import sm from "../slicemachine.config.json" with { type: "json" };

/**
 * The project's Prismic repository name.
 * Update `slicemachine.config.json` (or set PRISMIC_ENVIRONMENT)
 * once you've created your repo at prismic.io.
 */
export const repositoryName =
  process.env.PRISMIC_ENVIRONMENT || sm.repositoryName;

export const routes: prismic.ClientConfig["routes"] = [
  {
    type: "home",
    uid: "home",
    path: "/",
  },
  {
    type: "page",
    path: "/:uid",
  },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * Every call site runs at build time only (route loaders during
 * prerendering) — this site has no runtime server and no live preview.
 */
export const createClient = (config: prismic.ClientConfig = {}) => {
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

  return prismic.createClient(repositoryName, {
    accessToken,
    routes,
    ...config,
  });
};
