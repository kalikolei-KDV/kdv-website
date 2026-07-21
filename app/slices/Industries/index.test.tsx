import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import type { Content, SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import Industries from "./index";
import industriesModelJson from "./model.json";

describe("Industries", () => {
  it("renders the title and every list item", () => {
    const slice = mockSlice<Content.IndustriesSlice>(
      industriesModelJson as unknown as SharedSliceModel,
    );

    render(
      <Industries
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    expect(screen.getByText(text(slice.primary.title))).toBeInTheDocument();
    for (const item of slice.items) {
      expect(screen.getByText(text(item.label))).toBeInTheDocument();
    }
  });
});
