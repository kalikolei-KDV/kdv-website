import type { FC } from "react";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

export type IndustriesProps = SliceComponentProps<Content.IndustriesSlice>;

/**
 * Component for "Industries" Slices.
 */
const Industries: FC<IndustriesProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white px-[15px] py-[15px]"
    >
      <div className="flex w-full flex-col items-start gap-[15px] lg:flex-row">
        <p className="font-heading w-full text-[64px] leading-none font-normal tracking-[-3.2px] text-[color:var(--paragraph-primary,#422307)] lg:flex-1">
          {slice.primary.title}
        </p>

        <ul className="flex w-full flex-col items-start gap-[15px] lg:flex-1">
          {slice.items.map((item, index) => (
            <li
              key={index}
              className="flex w-full max-w-[320px] items-center py-[5px] lg:min-w-[240px]"
            >
              <p className="font-body flex-1 text-[20px] leading-[1.21] font-normal not-italic tracking-[-1px] text-[color:var(--paragraph-primary,#422307)]">
                {item.label}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[15px] hidden h-[40px] w-full border-b border-black md:block" />
    </section>
  );
};

export default Industries;
