"use client";

import { FC, useState } from "react";
import { isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { Content } from "@prismicio/client";

export type NavigationProps = SliceComponentProps<Content.NavigationSlice>;

/**
 * Component for "Navigation" Slices.
 */
const Navigation: FC<NavigationProps> = ({ slice }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="sticky top-0 z-50 w-full bg-white px-[15px]"
    >
      <div className="flex h-[46px] w-full items-center justify-between border-b border-[color:var(--paragraph-primary,#422307)] py-[10px]">
        <PrismicNextLink
          field={
            isFilled.link(slice.primary.logo_link)
              ? slice.primary.logo_link
              : { link_type: "Web", url: "/" }
          }
          className="flex items-center gap-[2px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nav-mark.svg"
            alt=""
            aria-hidden
            className="h-[20px] w-[11.54px]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nav-wordmark.svg"
            alt="Kingsmen"
            className="h-[14.4px] w-[94.61px]"
          />
        </PrismicNextLink>

        <ul className="hidden items-center gap-[50px] md:flex">
          {slice.items.map((item, index) => (
            <li key={index}>
              <PrismicNextLink
                field={item.link}
                className="text-[20px] leading-none font-normal tracking-[-1px] text-black"
              >
                {item.label}
              </PrismicNextLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          className="mix-blend-difference text-[20px] leading-none font-normal tracking-[-1px] text-white md:hidden"
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {isMenuOpen && (
        <ul className="flex w-full flex-col gap-[26px] py-[15px] md:hidden">
          {slice.items.map((item, index) => (
            <li key={index} className="w-full">
              <PrismicNextLink
                field={item.link}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-[20px] leading-none font-normal tracking-[-1px] text-black"
              >
                {item.label}
              </PrismicNextLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navigation;
