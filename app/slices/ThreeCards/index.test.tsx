import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { asText, type Content, type SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import ThreeCards from "./index";
import threeCardsModelJson from "./model.json";

function buildSlice() {
  return mockSlice<Content.ThreeCardsSlice>(
    threeCardsModelJson as unknown as SharedSliceModel,
  );
}

describe("ThreeCards", () => {
  it("renders the label/content header when label is filled", () => {
    const slice = buildSlice();

    render(
      <ThreeCards
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    expect(screen.getByText(text(slice.primary.label))).toBeInTheDocument();
    expect(screen.getByText(asText(slice.primary.content))).toBeInTheDocument();
  });

  it("omits the header entirely when label is empty", () => {
    const slice = buildSlice();
    const withoutHeader: Content.ThreeCardsSlice = {
      ...slice,
      primary: { ...slice.primary, label: "" },
    };

    render(
      <ThreeCards
        slice={withoutHeader}
        index={0}
        slices={[withoutHeader]}
        context={undefined}
      />,
    );

    // `content` is still filled — it should stay hidden because `label`
    // gates the whole header block, not just its own line.
    expect(
      screen.queryByText(asText(withoutHeader.primary.content)),
    ).not.toBeInTheDocument();
  });

  it("falls back to 'See Project' when a card's link label is empty", () => {
    const slice = buildSlice();
    const [firstItem, ...restItems] = slice.items;
    const withEmptyLinkLabel: Content.ThreeCardsSlice = {
      ...slice,
      items: [{ ...firstItem, link_label: "" }, ...restItems],
    };

    render(
      <ThreeCards
        slice={withEmptyLinkLabel}
        index={0}
        slices={[withEmptyLinkLabel]}
        context={undefined}
      />,
    );

    expect(
      screen.getByRole("link", { name: /See Project/ }),
    ).toBeInTheDocument();
  });
});
