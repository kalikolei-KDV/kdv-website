import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { asText, type Content, type SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import DeliveryTitleCta from "./index";
import deliveryTitleCtaModelJson from "./model.json";

describe("DeliveryTitleCta", () => {
  it("renders the title, description, and CTA from slice content", () => {
    const slice = mockSlice<Content.DeliveryTitleCtaSlice>(
      deliveryTitleCtaModelJson as unknown as SharedSliceModel,
    );

    render(
      <DeliveryTitleCta
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    expect(screen.getByText(text(slice.primary.title))).toBeInTheDocument();
    expect(
      screen.getByText(asText(slice.primary.description)),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: text(slice.primary.cta_label) }),
    ).toBeInTheDocument();
  });
});
