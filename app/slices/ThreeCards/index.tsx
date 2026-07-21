import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicLink } from "@/prismic-link";
import { PrismicImage } from "@/prismic-image";

export type ThreeCardsProps = SliceComponentProps<Content.ThreeCardsSlice>;

/**
 * Component for "ThreeCards" Slices.
 *
 * `label`/`content` are optional — filling them in renders a "Relevant
 * cases"-style label + rich text header directly above the card grid (same
 * layout as the TitledParagraph slice), matching the Figma composition where
 * that header sits flush against the cards with no gap. Leave them empty for
 * a plain card grid, as on the homepage.
 */
const ThreeCards: FC<ThreeCardsProps> = ({ slice }) => {
  const hasHeader = isFilled.keyText(slice.primary.label);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white px-[15px]"
    >
      {hasHeader && (
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
      )}

      <div
        className={`flex items-start gap-[15px] overflow-x-auto md:overflow-visible ${
          hasHeader ? "pb-[15px]" : "py-[15px]"
        }`}
      >
        {slice.items.map((item, index) => (
          <div
            key={index}
            className="flex w-[240px] flex-none flex-col overflow-clip md:w-auto md:flex-1"
          >
            <div className="relative aspect-[4/5] w-full bg-[#f4f4f4]">
              {isFilled.image(item.image) && (
                <PrismicImage
                  field={item.image}
                  className="absolute inset-0 h-full w-full object-cover"
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
                <PrismicLink
                  field={item.link}
                  className="inline-flex items-center gap-[3px] font-heading text-[16px] leading-[1.1] font-medium tracking-[-0.48px] text-[color:var(--paragraph-accent-2,#f83c00)]"
                >
                  {item.link_label || "See Project"}
                  <span aria-hidden>→</span>
                </PrismicLink>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThreeCards;
