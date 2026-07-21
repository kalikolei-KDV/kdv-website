import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import type { Content, SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import PageHeading from "./index";
import pageHeadingModelJson from "./model.json";

describe("PageHeading", () => {
  it("renders the title", () => {
    const slice = mockSlice<Content.PageHeadingSlice>(
      pageHeadingModelJson as unknown as SharedSliceModel,
    );

    render(
      <PageHeading
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    expect(
      screen.getByRole("heading", { name: text(slice.primary.title) }),
    ).toBeInTheDocument();
  });
});
