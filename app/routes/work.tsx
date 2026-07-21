import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { isFilled } from "@prismicio/client";

import { createClient } from "@/prismicio";
import { PrismicImage } from "@/prismic-image";

// Typed against plain react-router types rather than the generated
// `./+types/work` module, matching app/routes/home.tsx — this route is
// always registered unconditionally (see app/routes.ts), so a generated
// types module always exists too, but staying consistent with the other
// singleton-backed route avoids depending on it unnecessarily.
export async function loader() {
  const client = createClient();
  const [work, caseStudies] = await Promise.all([
    client.getSingle("work").catch(() => null),
    client.getAllByType("case_study").catch(() => []),
  ]);

  return { work, caseStudies };
}

type LoaderData = Awaited<ReturnType<typeof loader>>;

export const meta: MetaFunction = (args) => {
  const loaderData = args.loaderData as LoaderData | undefined;

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
};

export default function Work({ loaderData }: { loaderData: LoaderData }) {
  const { work, caseStudies } = loaderData;
  const title = work?.data.title || "Our work";

  return (
    <>
      <header className="flex flex-col items-start justify-end px-[15px] pt-[140px] pb-[15px]">
        <div className="w-full border-b border-black pb-[40px]">
          <h1 className="font-heading text-[80px] leading-[0.8] font-medium text-black md:text-[160px] lg:text-[200px]">
            {title}
          </h1>
        </div>
      </header>

      <ul className="flex flex-col px-[15px]">
        {caseStudies.map((caseStudy) => (
          <li
            key={caseStudy.id}
            className="flex flex-col items-stretch border-b border-black pb-[15px] md:flex-row"
          >
            <div className="flex w-full flex-col items-start justify-between gap-[15px] bg-white p-[15px] md:w-[320px] md:shrink-0">
              <div className="flex flex-col items-start gap-[10px]">
                {caseStudy.data.client && (
                  <p className="font-heading text-[10px] leading-[1.2] font-normal tracking-[0.6px] uppercase">
                    {caseStudy.data.client}
                  </p>
                )}
                <p className="font-heading text-[18px] leading-none font-semibold">
                  {caseStudy.data.title}
                </p>
              </div>
              <Link
                to={`/case-studies/${caseStudy.uid}`}
                className="inline-flex items-center gap-[3px] font-heading text-[16px] leading-[1.1] font-medium tracking-[-0.48px] text-[color:var(--paragraph-accent-2,#f83c00)]"
              >
                See Project
                <span aria-hidden>→</span>
              </Link>
            </div>

            <Link
              to={`/case-studies/${caseStudy.uid}`}
              className="relative aspect-[640/551] w-full overflow-hidden md:aspect-[1600/900] md:flex-1"
            >
              {isFilled.image(caseStudy.data.meta_image) && (
                <PrismicImage
                  field={caseStudy.data.meta_image}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <img
                src="/images/section-arrow.svg"
                alt=""
                aria-hidden
                className="absolute right-[15px] bottom-[13.5px] size-[15px] -scale-x-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
