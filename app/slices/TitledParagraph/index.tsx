import type { FC } from "react";
import type { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";

export type TitledParagraphProps =
  SliceComponentProps<Content.TitledParagraphSlice>;

/**
 * Component for "TitledParagraph" Slices. Reused for both the "Story" and
 * "Relevant cases" sections of the case study template — same label + rich
 * text layout, different content.
 */
const TitledParagraph: FC<TitledParagraphProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white px-[15px]"
    >
      <div className="grid w-full grid-cols-1 gap-[15px] border-t border-black py-[15px] md:grid-cols-3">
        <div className="flex w-full flex-col items-start md:sticky md:top-0">
          <p className="font-heading text-[24px] leading-none font-normal tracking-[-1.2px] text-black">
            {slice.primary.label}
          </p>
          <div className="flex w-full items-start justify-end">
            <img
              src="/images/section-arrow.svg"
              alt=""
              aria-hidden
              className="size-[15px] -scale-x-100"
            />
          </div>
        </div>
        <div className="font-body max-w-[720px] text-[18px] leading-[1.5] not-italic tracking-[-0.9px] text-[color:var(--paragraph-primary,#422307)] md:col-span-2">
          <PrismicRichText
            field={slice.primary.content}
            components={{
              paragraph: ({ children }) => <p>{children}</p>,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default TitledParagraph;
