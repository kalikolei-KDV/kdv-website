import type { FC } from "react";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

export type PageHeadingProps = SliceComponentProps<Content.PageHeadingSlice>;

/**
 * Component for "PageHeading" Slices. A large standalone section title with
 * a bottom border and no other content (e.g. "Our work" on /work) — kept
 * generic/reusable rather than baked into a specific page, per this repo's
 * "reuse before building new" convention (see AGENTS.md).
 */
const PageHeading: FC<PageHeadingProps> = ({ slice }) => {
  return (
    <header
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex flex-col items-start justify-end px-[15px] pt-[140px] pb-[15px]"
    >
      <div className="w-full border-b border-black pb-[40px]">
        <h1 className="font-heading text-[80px] leading-[0.8] font-medium text-black md:text-[160px] lg:text-[200px]">
          {slice.primary.title}
        </h1>
      </div>
    </header>
  );
};

export default PageHeading;
