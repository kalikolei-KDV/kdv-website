import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from "react";
import { Link } from "react-router";
import {
  PrismicLink as BasePrismicLink,
  type PrismicLinkProps,
} from "@prismicio/react";

type RouterLinkAdapterProps = Omit<ComponentPropsWithRef<typeof Link>, "to"> & {
  href: string;
};

/**
 * `PrismicLink`'s `internalComponent` contract passes an `href` prop (matching
 * `<a>`), but React Router's `Link` takes `to` instead — adapt between them.
 */
const RouterLinkAdapter = forwardRef<HTMLAnchorElement, RouterLinkAdapterProps>(
  ({ href, ...props }, ref) => <Link ref={ref} to={href} {...props} />,
);
RouterLinkAdapter.displayName = "RouterLinkAdapter";

/**
 * Prismic link component wired to React Router's `Link` for internal
 * navigation, matching the convenience `@prismicio/next`'s PrismicNextLink
 * used to provide.
 */
export function PrismicLink(props: PrismicLinkProps<RouterLinkAdapterProps>) {
  // `props` is a discriminated union (`field` | `document` | `href` variants).
  // TypeScript can't verify a spread of a union against BasePrismicLink's own
  // matching union prop type, even though it's the exact same shape — cast at
  // this internal forwarding boundary only; callers of `PrismicLink` above
  // still get full type-checking from this function's own signature.
  const forwardedProps = props as ComponentPropsWithoutRef<
    typeof BasePrismicLink
  >;

  return (
    <BasePrismicLink {...forwardedProps} internalComponent={RouterLinkAdapter} />
  );
}
