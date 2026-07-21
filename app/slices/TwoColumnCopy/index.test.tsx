import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { asText, type Content, type SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import TwoColumnCopy from "./index";
import twoColumnCopyModelJson from "./model.json";

describe("TwoColumnCopy", () => {
  it("renders every item's label and rich text content", () => {
    const slice = mockSlice<Content.TwoColumnCopySlice>(
      twoColumnCopyModelJson as unknown as SharedSliceModel,
    );

    render(
      <TwoColumnCopy
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    for (const item of slice.items) {
      expect(screen.getByText(text(item.label))).toBeInTheDocument();
      expect(screen.getByText(asText(item.content))).toBeInTheDocument();
    }
  });
});
