import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("home").catch(() => null);

  if (!page) {
    // No Prismic repo connected yet (or no "home" document published).
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 px-6 text-center text-white">
        <h1 className="text-3xl font-semibold">Starter is running 🎉</h1>
        <p className="max-w-md text-neutral-400">
          Connect a Prismic repository and add a{" "}
          <code className="rounded bg-neutral-800 px-1.5 py-0.5">home</code>{" "}
          document to see it rendered here via the Hero slice.
        </p>
        <p className="max-w-md text-sm text-neutral-500">
          Update <code>NEXT_PUBLIC_PRISMIC_ENVIRONMENT</code> in{" "}
          <code>.env.local</code> and <code>repositoryName</code> in{" "}
          <code>slicemachine.config.json</code> with your repo name, then run{" "}
          <code>npm run slicemachine</code> to push this content model.
        </p>
      </main>
    );
  }

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata() {
  const client = createClient();
  const page = await client.getSingle("home").catch(() => null);

  return {
    title: page?.data.meta_title || "Figma + Prismic Starter",
    description: page?.data.meta_description || "",
  };
}
