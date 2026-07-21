import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { PrismicLink } from "@/prismic-link";
import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";

export type FooterProps = SliceComponentProps<Content.FooterSlice>;

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="mr-[-15px] h-[80px] w-[46.53px] shrink-0">
        <img
          src="/images/footer-logo-mark-left.svg"
          alt=""
          aria-hidden
          className="block h-full w-full"
        />
      </div>
      <div className="h-[80px] w-[46.53px] shrink-0 -scale-x-100">
        <img
          src="/images/footer-logo-mark-right.svg"
          alt=""
          aria-hidden
          className="block h-full w-full"
        />
      </div>
    </div>
  );
}

function Wordmark() {
  return (
    <img
      src="/images/footer-wordmark.svg"
      alt="Kingsmen Digital Ventures"
      className="block h-full w-full"
    />
  );
}

/**
 * Component for "Footer" Slices.
 */
const Footer: FC<FooterProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-white px-[15px] pt-[60px] pb-[15px]"
    >
      <div className="flex w-full flex-col items-center gap-[127px]">
        <div className="flex w-full flex-col items-start gap-[15px] md:flex-row">
          <div className="flex w-full flex-col items-start md:w-auto md:flex-1">
            <LogoMark />
          </div>

          <div className="flex w-full flex-col items-start gap-[62px] md:flex-1 md:flex-row md:items-start md:justify-between">
            <div className="flex w-full flex-col items-start gap-[62px] text-[16px] text-[color:var(--paragraph-primary,#422307)] md:w-[227px] md:shrink-0">
              <div className="flex w-full flex-col items-start gap-[30px]">
                <p
                  className="w-full font-heading text-[16px] leading-none font-semibold tracking-[-0.8px]"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  OFFICE
                </p>
                <div className="w-full font-body leading-[1.5] not-italic">
                  <PrismicRichText
                    field={slice.primary.office_address}
                    components={{
                      paragraph: ({ children }) => <p>{children}</p>,
                    }}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-[30px]">
                <p
                  className="w-full font-heading text-[16px] leading-none font-semibold tracking-[-0.8px]"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  CONTACT
                </p>
                <div className="flex w-full flex-col items-start gap-[10px] font-body not-italic">
                  {isFilled.link(slice.primary.phone_link) ? (
                    <PrismicLink
                      field={slice.primary.phone_link}
                      className="block w-full cursor-pointer leading-[1.5]"
                    >
                      {slice.primary.phone_label}
                    </PrismicLink>
                  ) : (
                    <p className="w-full leading-[1.5]">
                      {slice.primary.phone_label}
                    </p>
                  )}
                  <p className="w-full leading-[1.5]">{slice.primary.email}</p>
                </div>
              </div>
            </div>

            <div className="flex w-[89px] flex-col items-start gap-[30px]">
              <p
                className="w-full font-heading text-[16px] leading-none font-semibold tracking-[-0.8px] text-[color:var(--paragraph-primary,#422307)]"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                SOCIAL
              </p>
              <div className="flex w-full flex-col items-start gap-[10px]">
                {slice.items.map((item, index) =>
                  isFilled.link(item.link) ? (
                    <PrismicLink
                      key={index}
                      field={item.link}
                      className="w-full font-body text-[16px] leading-[1.5] not-italic text-[color:var(--paragraph-primary,#422307)]"
                    >
                      {item.label}
                    </PrismicLink>
                  ) : (
                    <p
                      key={index}
                      className="w-full font-body text-[16px] leading-[1.5] not-italic text-[color:var(--paragraph-primary,#422307)]"
                    >
                      {item.label}
                    </p>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[24px]">
          {isFilled.link(slice.primary.logo_link) ? (
            <PrismicLink
              field={slice.primary.logo_link}
              className="flex aspect-[1250/106.08984375] w-full cursor-pointer items-center"
            >
              <Wordmark />
            </PrismicLink>
          ) : (
            <div className="flex aspect-[1250/106.08984375] w-full items-center">
              <Wordmark />
            </div>
          )}

          <div className="flex w-full items-center justify-between">
            <p
              className="text-[12px] leading-none font-normal whitespace-nowrap text-[color:var(--paragraph-primary,#422307)] tracking-[-0.6px]"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              {slice.primary.copyright_text}
            </p>
            {isFilled.link(slice.primary.privacy_link) && (
              <PrismicLink
                field={slice.primary.privacy_link}
                className="text-[12px] leading-none font-normal whitespace-nowrap text-[color:var(--paragraph-primary,#422307)] tracking-[-0.6px] underline [text-underline-position:from-font] decoration-solid decoration-from-font"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                {slice.primary.privacy_label || "Privacy Policy"}
              </PrismicLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
