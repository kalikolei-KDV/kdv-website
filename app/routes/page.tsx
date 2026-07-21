import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

// Typed against plain react-router types rather than the generated
// `./+types/page` module: that module only exists once this route is
// actually registered in `app/routes.ts`, which itself only happens once a
// Prismic `page` document exists (see routes.ts for why).
export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.uid) {
    throw new Response("Not Found", { status: 404 });
  }

  const client = createClient();
  const page = await client.getByUID("page", params.uid).catch(() => null);

  if (!page) {
    throw new Response("Not Found", { status: 404 });
  }

  return { page };
}

type LoaderData = Awaited<ReturnType<typeof loader>>;

export const meta: MetaFunction = (args) => {
  // Cast for the same reason as app/root.tsx: react-router's `SerializeFrom`
  // mangles Prismic's branded slice types rather than preserving them.
  const loaderData = args.loaderData as LoaderData | undefined;

  return [
    {
      title: loaderData?.page.data.meta_title || "Kingsmen Digital Ventures",
    },
    {
      name: "description",
      content: loaderData?.page.data.meta_description || "",
    },
  ];
};

export default function Page({ loaderData }: { loaderData: LoaderData }) {
  const { page } = loaderData;

  return <SliceZone slices={page.data.slices} components={components} />;
}
