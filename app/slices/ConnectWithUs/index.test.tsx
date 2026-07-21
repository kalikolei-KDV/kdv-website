import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import type { Content, SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import ConnectWithUs from "./index";
import connectWithUsModelJson from "./model.json";

function buildSlice() {
  return mockSlice<Content.ConnectWithUsSlice>(
    connectWithUsModelJson as unknown as SharedSliceModel,
  );
}

describe("ConnectWithUs", () => {
  it("renders the title as a link when link is filled", () => {
    const slice = buildSlice();

    render(
      <ConnectWithUs
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    expect(
      screen.getByRole("link", { name: text(slice.primary.title) }),
    ).toBeInTheDocument();
  });

  it("renders the title as plain text when link is empty", () => {
    const slice = buildSlice();
    const withoutLink: Content.ConnectWithUsSlice = {
      ...slice,
      primary: { ...slice.primary, link: { link_type: "Any" } },
    };

    render(
      <ConnectWithUs
        slice={withoutLink}
        index={0}
        slices={[withoutLink]}
        context={undefined}
      />,
    );

    expect(
      screen.queryByRole("link", { name: text(withoutLink.primary.title) }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(text(withoutLink.primary.title)),
    ).toBeInTheDocument();
  });
});
