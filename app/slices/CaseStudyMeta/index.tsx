import type { FC } from "react";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

export type CaseStudyMetaProps = SliceComponentProps<Content.CaseStudyMetaSlice>;

/**
 * Component for "CaseStudyMeta" Slices.
 */
const CaseStudyMeta: FC<CaseStudyMetaProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white p-[15px]"
    >
      <div className="flex w-full flex-col gap-[15px] border-b border-black pb-[15px] md:flex-row md:gap-0">
        {slice.items.map((item, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col gap-[6px] text-[color:var(--paragraph-primary,#422307)]"
          >
            <p className="font-heading text-[10px] leading-[1.2] font-medium tracking-[0.6px] uppercase">
              {item.label}
            </p>
            <p className="font-heading text-[20px] leading-none font-normal tracking-[-0.4px]">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseStudyMeta;
