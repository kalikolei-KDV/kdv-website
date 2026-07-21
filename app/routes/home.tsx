import { SliceZone } from "@prismicio/react";

import type { Route } from "./+types/home";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export async function loader() {
  const client = createClient();
  const page = await client.getSingle("home").catch(() => null);

  return { page };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: loaderData?.page?.data.meta_title || "Kingsmen Digital Ventures",
    },
    {
      name: "description",
      content: loaderData?.page?.data.meta_description || "",
    },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { page } = loaderData;

  if (!page) {
    // No Prismic repo connected yet (or no "home" document published).
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 px-6 text-center text-white">
        <h1 className="text-3xl font-semibold">Starter is running 🎉</h1>
        <p className="max-w-md text-neutral-400">
          Connect a Prismic repository and add a{" "}
          <code className="rounded bg-neutral-800 px-1.5 py-0.5">home</code>{" "}
          document to see it rendered here.
        </p>
        <p className="max-w-md text-sm text-neutral-500">
          Update <code>PRISMIC_ENVIRONMENT</code> in <code>.env.local</code> and{" "}
          <code>repositoryName</code> in <code>slicemachine.config.json</code>{" "}
          with your repo name.
        </p>
      </main>
    );
  }

  return <SliceZone slices={page.data.slices} components={components} />;
}
