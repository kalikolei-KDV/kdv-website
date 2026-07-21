import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { Link } from "react-router";
import { PrismicImage } from "@/prismic-image";

export type CaseStudiesListProps =
  SliceComponentProps<Content.CaseStudiesListSlice>;

type CaseStudiesListContext = {
  caseStudies: Content.CaseStudyDocument[];
};

/**
 * Component for "CaseStudiesList" Slices. Renders every published
 * case_study document as a grid — not manually curated slice items, since
 * that would mean re-entering each case study's title/image/link a second
 * time. The route's loader fetches all case studies up front and passes
 * them through `SliceZone`'s `context` prop (see app/routes/work.tsx),
 * which is untyped by default — cast at this boundary, matching this
 * codebase's convention elsewhere for Prismic/React Router typing friction
 * (see AGENTS.md's TypeScript gotchas).
 */
const CaseStudiesList: FC<CaseStudiesListProps> = ({ slice, context }) => {
  const { caseStudies } = context as CaseStudiesListContext;

  return (
    <ul
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex flex-col px-[15px]"
    >
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
            {isFilled.image(caseStudy.data.listing_image) && (
              <PrismicImage
                field={caseStudy.data.listing_image}
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
  );
};

export default CaseStudiesList;
