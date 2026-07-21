import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicImage } from "@/prismic-image";

export type CaseStudyHeaderProps =
  SliceComponentProps<Content.CaseStudyHeaderSlice>;

/**
 * Component for "CaseStudyHeader" Slices.
 *
 * The nav overlaid on the hero image on desktop/tablet is the global
 * Navigation slice rendered in transparent mode (see app/root.tsx and
 * app/routes/case-study.tsx's `handle`), not baked into this slice — avoids
 * rendering two navs stacked on top of each other.
 */
const CaseStudyHeader: FC<CaseStudyHeaderProps> = ({ slice }) => {
  const hasImage = isFilled.image(slice.primary.background_image);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full"
    >
      {/* Desktop / tablet: image with the title overlaid at the bottom */}
      <header className="relative hidden h-[500px] w-full flex-col items-start justify-end overflow-hidden px-[15px] pb-[8px] md:flex lg:h-[520px]">
        {hasImage && (
          <PrismicImage
            field={slice.primary.background_image}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-black/10" />
        <h1 className="relative max-w-[880px] font-heading text-[64px] leading-none font-medium text-white lg:text-[80px]">
          {slice.primary.title}
        </h1>
      </header>

      {/* Mobile: image above, title below (no overlay) */}
      <div className="relative h-[211px] w-full overflow-hidden md:hidden">
        {hasImage && (
          <PrismicImage
            field={slice.primary.background_image}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-black/10" />
      </div>
      <div className="px-[15px] py-[15px] md:hidden">
        <h1 className="font-heading text-[32px] leading-none font-medium text-[color:var(--paragraph-primary,#422307)]">
          {slice.primary.title}
        </h1>
      </div>
    </section>
  );
};

export default CaseStudyHeader;
