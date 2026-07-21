import type { FC } from "react";
import type { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";

export type TwoColumnCopyProps =
  SliceComponentProps<Content.TwoColumnCopySlice>;

/**
 * Component for "TwoColumnCopy" Slices.
 */
const TwoColumnCopy: FC<TwoColumnCopyProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white px-[15px]"
    >
      <div className="grid w-full grid-cols-1 gap-[15px] py-[15px] md:grid-cols-2 [&>div:not(:last-child)]:md:border-r [&>div:not(:last-child)]:md:border-black">
        {slice.items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-start gap-[15px] pr-[60px] md:flex-row"
          >
            <p className="w-full max-w-[180px] flex-1 font-heading text-[24px] leading-none font-normal tracking-[-1.2px] text-black">
              {item.label}
            </p>
            <div className="font-body w-full max-w-[720px] flex-1 text-[16px] leading-[1.5] not-italic text-[color:var(--paragraph-primary,#422307)]">
              <PrismicRichText
                field={item.content}
                components={{
                  paragraph: ({ children }) => <p>{children}</p>,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TwoColumnCopy;
