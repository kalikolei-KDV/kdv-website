import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicImage } from "@/prismic-image";

export type CaseStudyGalleryProps =
  SliceComponentProps<Content.CaseStudyGallerySlice>;

/**
 * Component for "CaseStudyGallery" Slices. Image-only card grid — distinct
 * from the homepage's ThreeCards slice, which also carries title/paragraph/
 * link content.
 */
const CaseStudyGallery: FC<CaseStudyGalleryProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white px-[15px] py-[15px]"
    >
      <div className="flex items-start gap-[15px] overflow-x-auto md:overflow-visible">
        {slice.items.map(
          (item, index) =>
            isFilled.image(item.image) && (
              <div
                key={index}
                className="aspect-[160/237] w-[240px] flex-none md:w-auto md:flex-1"
              >
                <PrismicImage
                  field={item.image}
                  className="h-full w-full object-cover"
                />
              </div>
            ),
        )}
      </div>
    </section>
  );
};

export default CaseStudyGallery;
