import type { ImgHTMLAttributes } from "react";
import { isFilled } from "@prismicio/client";
import type { ImageField } from "@prismicio/client";

type PrismicImageProps = {
  field: ImageField<never> | null | undefined;
} & Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height"
>;

/**
 * Renders a Prismic image field as a plain `<img>`, pulling `src`/`alt`/
 * dimensions straight from the field. Prismic's CDN already serves
 * optimized assets, so no framework-specific image component is needed.
 */
export function PrismicImage({ field, ...props }: PrismicImageProps) {
  if (!isFilled.image(field)) return null;

  return (
    <img
      src={field.url}
      alt={field.alt ?? ""}
      width={field.dimensions.width}
      height={field.dimensions.height}
      {...props}
    />
  );
}
