import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { PrismicLink } from "@/prismic-link";
import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";

export type DeliveryTitleCtaProps =
  SliceComponentProps<Content.DeliveryTitleCtaSlice>;

/**
 * Component for "DeliveryTitleCta" Slices.
 */
const DeliveryTitleCta: FC<DeliveryTitleCtaProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-[var(--page-bg,white)] px-[15px] py-[15px]"
    >
      <div className="w-full border-t border-black">
        <div className="flex w-full flex-col items-start gap-[15px] py-[15px] md:flex-row md:items-start">
          <div className="w-full md:flex-1 md:py-[15px] md:pr-[30px]">
            <p className="font-heading text-[24px] leading-none font-normal tracking-[-1.2px] text-black">
              {slice.primary.title}
            </p>
          </div>

          <div className="flex w-full flex-col items-start gap-[10px] md:flex-1 md:py-[15px]">
            <div className="font-body max-w-[640px] text-[18px] leading-[1.5] not-italic text-[color:var(--paragraph-primary,#422307)]">
              <PrismicRichText
                field={slice.primary.description}
                components={{
                  paragraph: ({ children }) => (
                    <p className="tracking-[-0.9px]">{children}</p>
                  ),
                }}
              />
            </div>

            {isFilled.link(slice.primary.cta_link) && (
              <PrismicLink
                field={slice.primary.cta_link}
                className="inline-flex items-center justify-center bg-black px-[16px] py-[8px] text-[16px] leading-[1.1] font-medium tracking-[-0.48px] text-white"
              >
                {slice.primary.cta_label || "View our work"}
              </PrismicLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryTitleCta;
