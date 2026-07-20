import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

export type ThreeCardsProps = SliceComponentProps<Content.ThreeCardsSlice>;

/**
 * Component for "ThreeCards" Slices.
 */
const ThreeCards: FC<ThreeCardsProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white px-[15px] py-[15px]"
    >
      <div className="flex items-start gap-[15px] overflow-x-auto md:overflow-visible">
        {slice.items.map((item, index) => (
          <div
            key={index}
            className="flex w-[240px] flex-none flex-col overflow-clip md:w-auto md:flex-1"
          >
            <div className="relative aspect-[4/5] w-full bg-[#f4f4f4]">
              {isFilled.image(item.image) && (
                <PrismicNextImage
                  field={item.image}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex w-full flex-col items-start gap-[15px] py-[15px] md:pr-[15px] lg:pr-[30px]">
              <div className="flex w-full flex-col items-start gap-[5px]">
                <h3 className="font-heading text-[20px] leading-[1.1] font-semibold tracking-[-0.6px] text-black">
                  {item.title}
                </h3>
                <p className="font-body text-[14px] leading-[1.5] font-normal not-italic text-[color:var(--paragraph-secondary,#767676)]">
                  {item.paragraph}
                </p>
              </div>

              {isFilled.link(item.link) && (
                <PrismicNextLink
                  field={item.link}
                  className="inline-flex items-center gap-[3px] font-heading text-[16px] leading-[1.1] font-medium tracking-[-0.48px] text-[color:var(--paragraph-accent-2,#f83c00)]"
                >
                  {item.link_label || "See Project"}
                  <span aria-hidden>→</span>
                </PrismicNextLink>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThreeCards;
