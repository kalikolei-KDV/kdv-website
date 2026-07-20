import * as prismic from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "../slicemachine.config.json";

/**
 * The project's Prismic repository name.
 * Update `slicemachine.config.json` (or set NEXT_PUBLIC_PRISMIC_ENVIRONMENT)
 * once you've created your repo at prismic.io.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

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
 */
export const createClient = (config: prismic.ClientConfig = {}) => {
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

  const client = prismic.createClient(repositoryName, {
    accessToken,
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
};
