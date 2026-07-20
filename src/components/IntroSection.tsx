const RATING_STAR_COUNT = 5;

type RatingBadgeProps = {
  className?: string;
};

function RatingBadge({ className = "" }: RatingBadgeProps) {
  return (
    <div
      className={`flex h-[40px] shrink-0 items-center gap-[10px] rounded-full bg-[#f2f2f2] px-[20px] py-[4px] ${className}`}
    >
      <div className="flex h-[32px] items-center gap-[16px]">
        <div className="flex items-center gap-[8px]">
          <div className="flex items-start gap-[4px]">
            {Array.from({ length: RATING_STAR_COUNT }).map((_, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src="/images/star.svg"
                alt=""
                aria-hidden
                className="h-[15.36px] w-[16px]"
              />
            ))}
          </div>
          <p className="whitespace-nowrap font-body text-[16px] leading-[1.5] font-medium text-[#0a0c0f]">
            5.0
          </p>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/clutch-logo.svg"
        alt="Clutch"
        className="h-[16px] w-[58.264px]"
      />
    </div>
  );
}

export default function IntroSection() {
  return (
    <section className="w-full px-[15px] pt-[60px] md:pt-[140px]">
      <div className="flex w-full flex-col items-start">
        <div className="flex w-full flex-col items-end gap-[30px] pb-[40px] md:items-start md:gap-[32px] md:pt-[10px] lg:flex-row lg:items-end">
          <h1 className="w-full font-heading text-[32px] leading-[1.1] font-normal tracking-[-1.6px] text-black [word-break:break-word] md:max-w-[820px] md:text-[56px] md:tracking-[-2.8px] lg:w-auto lg:flex-1 lg:text-[64px] lg:tracking-[-3.2px]">
            We are the digital innovation extension of your company.
          </h1>

          <div className="flex w-full max-w-[480px] flex-col items-start gap-[20px] md:max-w-none md:flex-row md:items-start md:gap-[32px] lg:max-w-[480px] lg:flex-1 lg:flex-col">
            <p className="w-full font-body text-[16px] leading-[1.5] font-normal text-[#0a0c0f] [word-break:break-word] md:min-w-px md:flex-1">
              Partnering with visionaries to craft digital solutions that transform industries.
            </p>
            <RatingBadge className="w-full justify-between md:w-auto md:justify-start" />
          </div>
        </div>

        <div
          aria-hidden
          role="presentation"
          data-name="Hero media"
          className="aspect-[8/5] w-full bg-black lg:aspect-video"
        />
      </div>
    </section>
  );
}
