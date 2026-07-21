import type { FC } from "react";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

export type CaseStudyFeedbackProps =
  SliceComponentProps<Content.CaseStudyFeedbackSlice>;

/**
 * Component for "CaseStudyFeedback" Slices.
 */
const CaseStudyFeedback: FC<CaseStudyFeedbackProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white px-[15px]"
    >
      <div className="grid w-full grid-cols-1 gap-[15px] py-[15px] md:grid-cols-3">
        <p className="font-heading text-[24px] leading-none font-normal tracking-[-1.2px] text-black md:sticky md:top-0">
          {slice.primary.label}
        </p>
        <div className="flex max-w-[720px] flex-col gap-[5px] md:col-span-2">
          <p className="font-heading text-[48px] leading-[1.1] font-normal tracking-[-2.4px] text-black">
            {slice.primary.quote}
          </p>
          <div className="font-body flex flex-col text-[16px] leading-[1.5] not-italic">
            <p className="text-[color:var(--paragraph-primary,#422307)]">
              {slice.primary.name}
            </p>
            <p className="text-[color:var(--paragraph-secondary,#767676)]">
              {slice.primary.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyFeedback;
