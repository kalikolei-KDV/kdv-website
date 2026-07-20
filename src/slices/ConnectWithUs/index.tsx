import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

export type ConnectWithUsProps =
  SliceComponentProps<Content.ConnectWithUsSlice>;

/**
 * Component for "ConnectWithUs" Slices.
 */
const ConnectWithUs: FC<ConnectWithUsProps> = ({ slice }) => {
  const headingClassName =
    "block w-full font-heading text-[37px] leading-none font-normal tracking-[-1.11px] text-black";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white px-[15px]"
    >
      <div className="w-full border-b border-black py-[30px]">
        {isFilled.link(slice.primary.link) ? (
          <PrismicNextLink field={slice.primary.link} className={headingClassName}>
            {slice.primary.title}
          </PrismicNextLink>
        ) : (
          <p className={headingClassName}>{slice.primary.title}</p>
        )}
      </div>
    </section>
  );
};

export default ConnectWithUs;
