import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicImage } from "@/prismic-image";

export type CaseStudyHeaderProps =
  SliceComponentProps<Content.CaseStudyHeaderSlice>;

const NAV_LINKS = [
  "Work",
  "Services",
  "Solutions",
  "About",
  "Insights",
  "Contact",
];

/**
 * Decorative nav-look overlay matching the Figma hero treatment. It's static
 * (not Prismic-driven) — the real, functional nav is the global Navigation
 * slice rendered above every page in app/root.tsx.
 */
function DecorativeNavOverlay() {
  return (
    <div className="absolute inset-x-0 top-0 hidden h-[46px] items-center justify-between border-b border-white px-[15px] md:flex">
      <div className="flex items-center gap-[2px]">
        <img
          src="/images/nav-mark-white.svg"
          alt=""
          aria-hidden
          className="h-[20px] w-[11.54px]"
        />
        <img
          src="/images/nav-wordmark-white.svg"
          alt="Kingsmen"
          className="h-[14.4px] w-[94.61px]"
        />
      </div>
      <ul className="flex items-center gap-[50px]">
        {NAV_LINKS.map((label) => (
          <li
            key={label}
            className="text-[20px] leading-none font-normal tracking-[-1px] text-white"
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Component for "CaseStudyHeader" Slices.
 */
const CaseStudyHeader: FC<CaseStudyHeaderProps> = ({ slice }) => {
  const hasImage = isFilled.image(slice.primary.background_image);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full"
    >
      {/* Desktop / tablet: image with the title and decorative nav overlaid */}
      <header className="relative hidden h-[500px] w-full flex-col items-start justify-end overflow-hidden px-[15px] pt-[15px] pb-[8px] md:flex lg:h-[520px]">
        {hasImage && (
          <PrismicImage
            field={slice.primary.background_image}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-black/10" />
        <DecorativeNavOverlay />
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
