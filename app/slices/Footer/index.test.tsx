import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import type { Content, SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import Footer from "./index";
import footerModelJson from "./model.json";

function buildSlice() {
  return mockSlice<Content.FooterSlice>(
    footerModelJson as unknown as SharedSliceModel,
  );
}

describe("Footer", () => {
  it("renders the phone number as a link when phone_link is filled", () => {
    const slice = buildSlice();

    render(
      <Footer slice={slice} index={0} slices={[slice]} context={undefined} />,
    );

    expect(
      screen.getByRole("link", { name: text(slice.primary.phone_label) }),
    ).toBeInTheDocument();
  });

  it("renders the phone number as plain text when phone_link is empty", () => {
    const slice = buildSlice();
    const withoutPhoneLink: Content.FooterSlice = {
      ...slice,
      primary: { ...slice.primary, phone_link: { link_type: "Any" } },
    };

    render(
      <Footer
        slice={withoutPhoneLink}
        index={0}
        slices={[withoutPhoneLink]}
        context={undefined}
      />,
    );

    expect(
      screen.queryByRole("link", {
        name: text(withoutPhoneLink.primary.phone_label),
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(text(withoutPhoneLink.primary.phone_label)),
    ).toBeInTheDocument();
  });

  it("omits the privacy link when it is empty", () => {
    const slice = buildSlice();
    const withoutPrivacyLink: Content.FooterSlice = {
      ...slice,
      primary: { ...slice.primary, privacy_link: { link_type: "Any" } },
    };

    render(
      <Footer
        slice={withoutPrivacyLink}
        index={0}
        slices={[withoutPrivacyLink]}
        context={undefined}
      />,
    );

    expect(
      screen.queryByText(text(withoutPrivacyLink.primary.privacy_label)),
    ).not.toBeInTheDocument();
  });
});
