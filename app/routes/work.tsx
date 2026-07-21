import { SliceZone } from "@prismicio/react";

import type { Route } from "./+types/work";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export async function loader() {
  const client = createClient();
  const [work, caseStudies] = await Promise.all([
    client.getSingle("work").catch(() => null),
    client.getAllByType("case_study").catch(() => []),
  ]);

  return { work, caseStudies };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title:
        loaderData?.work?.data.meta_title ||
        "Our work — Kingsmen Digital Ventures",
    },
    {
      name: "description",
      content: loaderData?.work?.data.meta_description || "",
    },
  ];
}

export default function Work({ loaderData }: Route.ComponentProps) {
  const { work, caseStudies } = loaderData;

  if (!work) {
    // No "work" document published yet — same fallback pattern as home.tsx.
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 px-6 text-center text-white">
        <h1 className="text-3xl font-semibold">No "work" document yet</h1>
        <p className="max-w-md text-neutral-400">
          Create and publish a{" "}
          <code className="rounded bg-neutral-800 px-1.5 py-0.5">Work</code>{" "}
          document in Prismic, add a{" "}
          <code className="rounded bg-neutral-800 px-1.5 py-0.5">
            Page Heading
          </code>{" "}
          and{" "}
          <code className="rounded bg-neutral-800 px-1.5 py-0.5">
            Case Studies List
          </code>{" "}
          slice, then rebuild.
        </p>
      </main>
    );
  }

  return (
    <SliceZone
      slices={work.data.slices}
      components={components}
      context={{ caseStudies }}
    />
  );
}
