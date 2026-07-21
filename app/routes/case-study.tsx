import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

// Typed against plain react-router types rather than the generated
// `./+types/case-study` module: that module only exists once this route is
// actually registered in `app/routes.ts`, which itself only happens once a
// Prismic `case_study` document exists (see routes.ts for why).
export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.uid) {
    throw new Response("Not Found", { status: 404 });
  }

  const client = createClient();
  const caseStudy = await client
    .getByUID("case_study", params.uid)
    .catch(() => null);

  if (!caseStudy) {
    throw new Response("Not Found", { status: 404 });
  }

  return { caseStudy };
}

type LoaderData = Awaited<ReturnType<typeof loader>>;

// Read by app/root.tsx's Layout (via useMatches) to render the global
// Navigation slice in its transparent, white-on-image variant instead of
// the default sticky white bar — this page opens with a full-bleed hero.
export const handle = { transparentNav: true };

export const meta: MetaFunction = (args) => {
  // Cast for the same reason as app/root.tsx: react-router's `SerializeFrom`
  // mangles Prismic's branded slice types rather than preserving them.
  const loaderData = args.loaderData as LoaderData | undefined;

  return [
    {
      title:
        loaderData?.caseStudy.data.meta_title || "Kingsmen Digital Ventures",
    },
    {
      name: "description",
      content: loaderData?.caseStudy.data.meta_description || "",
    },
  ];
};

export default function CaseStudy({ loaderData }: { loaderData: LoaderData }) {
  const { caseStudy } = loaderData;

  return (
    <SliceZone slices={caseStudy.data.slices} components={components} />
  );
}
