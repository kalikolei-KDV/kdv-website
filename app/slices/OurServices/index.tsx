import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { PrismicLink } from "@/prismic-link";
import type { SliceComponentProps } from "@prismicio/react";

export type OurServicesProps = SliceComponentProps<Content.OurServicesSlice>;

type ServiceItem = Content.OurServicesSliceDefaultItem;

function groupByCategory(items: readonly ServiceItem[]) {
  const groups: { category: string | null; items: ServiceItem[] }[] = [];

  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.category === item.category) {
      last.items.push(item);
    } else {
      groups.push({ category: item.category, items: [item] });
    }
  }

  return groups;
}

/**
 * Component for "OurServices" Slices.
 */
const OurServices: FC<OurServicesProps> = ({ slice }) => {
  const groups = groupByCategory(slice.items);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white px-[15px] py-[20px]"
    >
      <div className="flex w-full flex-col items-start gap-[15px] lg:flex-row">
        <p className="font-heading w-full text-[64px] leading-none font-normal tracking-[-3.2px] text-[color:var(--paragraph-primary,#422307)] lg:flex-1">
          {slice.primary.title}
        </p>

        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-1">
          <div className="grid w-full grid-cols-1 gap-y-[40px] md:grid-cols-2 md:gap-x-[15px]">
            {groups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="flex w-full flex-col items-start gap-[20px] pr-[20px]"
              >
                <p className="font-heading text-[15px] leading-[1.1] font-normal tracking-[-0.45px] text-[color:var(--paragraph-secondary,#767676)] uppercase md:text-[16px] md:tracking-[-0.48px]">
                  {group.category}
                </p>
                <ul className="flex w-full flex-col items-start gap-[5px]">
                  {group.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex w-full items-center py-[5px]"
                    >
                      <p className="font-body flex-1 text-[20px] leading-[1.21] font-normal not-italic tracking-[-1px] text-[color:var(--paragraph-primary,#422307)]">
                        {item.label}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {isFilled.link(slice.primary.cta_link) && (
            <PrismicLink
              field={slice.primary.cta_link}
              className="inline-flex items-center justify-center gap-[3px] font-heading text-[20px] leading-[1.1] font-medium tracking-[-0.6px] text-[color:var(--paragraph-primary,#422307)]"
            >
              {slice.primary.cta_label || "Our Services"}
              <span aria-hidden>→</span>
            </PrismicLink>
          )}
        </div>
      </div>

      <div className="mt-[20px] hidden h-[40px] w-full border-b border-black md:block" />
    </section>
  );
};

export default OurServices;
