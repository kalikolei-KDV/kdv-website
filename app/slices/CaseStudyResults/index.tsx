import type { FC } from "react";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

export type CaseStudyResultsProps =
  SliceComponentProps<Content.CaseStudyResultsSlice>;

/**
 * Component for "CaseStudyResults" Slices.
 */
const CaseStudyResults: FC<CaseStudyResultsProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white px-[15px] py-[15px]"
    >
      <div className="flex flex-col gap-[24px] border-y border-black py-[15px] md:flex-row md:gap-[15px] [&>div:not(:last-child)]:border-black [&>div:not(:last-child)]:pb-[24px] [&>div:not(:last-child)]:md:border-r [&>div:not(:last-child)]:md:border-b-0 [&>div:not(:last-child)]:md:pb-0 [&>div:not(:last-child)]:md:pr-[15px]">
        {slice.items.map((item, index) => (
          <div key={index} className="flex flex-1 flex-col gap-[24px] py-[5px]">
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center gap-[24px]">
                <p className="font-heading text-[72px] leading-none font-normal tracking-[-3.6px] text-black">
                  {item.value}
                </p>
                <span aria-hidden className="text-[32px] text-teal-400">
                  ↑
                </span>
              </div>
              <p className="font-body text-[16px] leading-[1.5] not-italic text-[color:var(--paragraph-primary,#422307)]">
                {item.name}
              </p>
            </div>
            <p className="font-body max-w-[320px] text-[16px] leading-[1.5] not-italic text-[color:var(--paragraph-secondary,#767676)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseStudyResults;
