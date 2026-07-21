import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicLink } from "@/prismic-link";
import { PrismicImage } from "@/prismic-image";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;
const RATING_STAR_COUNT = 5;

function RatingBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-[40px] shrink-0 items-center gap-[10px] rounded-full bg-[#f2f2f2] px-[20px] py-[4px] ${className}`}
    >
      <div className="flex h-[32px] items-center gap-[16px]">
        <div className="flex items-center gap-[8px]">
          <div className="flex items-start gap-[4px]">
            {Array.from({ length: RATING_STAR_COUNT }).map((_, index) => (
              <img
                key={index}
                src="/images/star.svg"
                alt=""
                aria-hidden
                className="h-[15.36px] w-[16px]"
              />
            ))}
          </div>
          <p className="whitespace-nowrap font-body text-[16px] leading-[1.5] font-medium text-[#0a0c0f]">
            5.0
          </p>
        </div>
      </div>
      <img
        src="/images/clutch-logo.svg"
        alt="Clutch"
        className="h-[16px] w-[58.264px]"
      />
    </div>
  );
}

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  const videoUrl =
    isFilled.link(slice.primary.video) &&
    slice.primary.video.link_type === "Media"
      ? slice.primary.video.url
      : undefined;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white px-[15px] pt-[60px] md:pt-[140px]"
    >
      <div className="flex w-full flex-col items-start">
        <div className="flex w-full flex-col items-end gap-[30px] pb-[40px] md:items-start md:gap-[32px] md:pt-[10px] lg:flex-row lg:items-end">
          <div className="w-full md:max-w-[820px] lg:w-auto lg:flex-1">
            <PrismicRichText
              field={slice.primary.heading}
              components={{
                heading1: ({ children }) => (
                  <h1 className="font-heading text-[32px] leading-[1.1] font-normal tracking-[-1.6px] text-black [word-break:break-word] md:text-[56px] md:tracking-[-2.8px] lg:text-[64px] lg:tracking-[-3.2px]">
                    {children}
                  </h1>
                ),
                heading2: ({ children }) => (
                  <h2 className="font-heading text-[32px] leading-[1.1] font-normal tracking-[-1.6px] text-black [word-break:break-word] md:text-[56px] md:tracking-[-2.8px] lg:text-[64px] lg:tracking-[-3.2px]">
                    {children}
                  </h2>
                ),
              }}
            />
          </div>

          <div className="flex w-full max-w-[480px] flex-col items-start gap-[20px] md:max-w-none md:flex-row md:items-start md:gap-[32px] lg:max-w-[480px] lg:flex-1 lg:flex-col">
            <PrismicRichText
              field={slice.primary.subheading}
              components={{
                paragraph: ({ children }) => (
                  <p className="w-full font-body text-[16px] leading-[1.5] font-normal text-[#0a0c0f] [word-break:break-word] md:min-w-px md:flex-1">
                    {children}
                  </p>
                ),
              }}
            />

            <div className="flex w-full flex-col gap-3 md:w-auto">
              <RatingBadge className="w-full justify-between md:w-auto md:justify-start" />
              {isFilled.link(slice.primary.cta_link) && (
                <PrismicLink
                  field={slice.primary.cta_link}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#0a0c0f] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#222] md:w-auto"
                >
                  {slice.primary.cta_label || "Learn more"}
                </PrismicLink>
              )}
            </div>
          </div>
        </div>

        {videoUrl ? (
          <div className="w-full">
            <video
              src={videoUrl}
              className="aspect-[8/5] w-full object-cover lg:aspect-video"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          </div>
        ) : isFilled.image(slice.primary.image) ? (
          <div className="w-full">
            <PrismicImage
              field={slice.primary.image}
              className="aspect-[8/5] w-full object-cover lg:aspect-video"
            />
          </div>
        ) : (
          <div
            aria-hidden
            role="presentation"
            data-name="Hero media"
            className="aspect-[8/5] w-full bg-black lg:aspect-video"
          />
        )}
      </div>
    </section>
  );
};

export default Hero;
