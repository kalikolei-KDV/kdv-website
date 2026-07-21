import { Fragment } from "react";
import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { PrismicLink } from "@/prismic-link";
import { PrismicImage } from "@/prismic-image";
import type { SliceComponentProps } from "@prismicio/react";

export type StatsSectionProps = SliceComponentProps<Content.StatsSectionSlice>;

/**
 * Component for "StatsSection" Slices.
 */
const StatsSection: FC<StatsSectionProps> = ({ slice }) => {
  const stats = [
    { value: slice.primary.stat_1_value, label: slice.primary.stat_1_label },
    { value: slice.primary.stat_2_value, label: slice.primary.stat_2_label },
    { value: slice.primary.stat_3_value, label: slice.primary.stat_3_label },
  ].filter((stat) => stat.value);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white"
    >
      {slice.items.length > 0 && (
        <div className="flex w-full items-center gap-[60px] overflow-x-auto px-[15px] py-[15px] lg:gap-[100px] lg:px-[100px] lg:py-[30px]">
          {slice.items.map(
            (item, index) =>
              isFilled.image(item.badge_image) && (
                <div key={index} className="h-[80px] flex-none">
                  <PrismicImage
                    field={item.badge_image}
                    className="h-full w-auto object-contain"
                  />
                </div>
              ),
          )}
        </div>
      )}

      <div className="flex w-full flex-col items-start gap-[15px] px-[15px] py-[15px] lg:flex-row">
        <div className="w-full lg:flex-1">
          <p className="max-w-[325px] text-[30px] leading-none font-normal tracking-[-0.6px] text-black">
            {slice.primary.intro}
          </p>
        </div>

        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-1">
          <div className="flex w-full flex-col items-start gap-[20px]">
            {stats.map((stat, index) => (
              <Fragment key={index}>
                {index > 0 && <div className="h-px w-full bg-black" />}
                <div className="flex flex-col items-start gap-[17px] leading-[1.1]">
                  <p className="text-[64px] font-normal tracking-[-3.2px] text-black md:text-[80px] md:tracking-[-4px] lg:text-[105px] lg:tracking-[-5.25px]">
                    {stat.value}
                  </p>
                  <p className="font-body max-w-[387px] text-[16px] font-normal not-italic tracking-[-0.48px] text-black">
                    {stat.label}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>

          {isFilled.link(slice.primary.cta_link) && (
            <PrismicLink
              field={slice.primary.cta_link}
              className="inline-flex items-center gap-[3px] font-heading text-[20px] leading-[1.1] font-medium tracking-[-0.6px] text-[#767676]"
            >
              {slice.primary.cta_label || "About Us"}
              <span aria-hidden className="text-[16px] tracking-[-0.48px]">
                →
              </span>
            </PrismicLink>
          )}
        </div>
      </div>

      <div className="hidden h-[40px] w-full border-b border-black md:block" />
    </section>
  );
};

export default StatsSection;
