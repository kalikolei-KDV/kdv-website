import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { asText, type Content, type SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import TitledParagraph from "./index";
import titledParagraphModelJson from "./model.json";

describe("TitledParagraph", () => {
  it("renders the label and rich text content", () => {
    const slice = mockSlice<Content.TitledParagraphSlice>(
      titledParagraphModelJson as unknown as SharedSliceModel,
    );

    render(
      <TitledParagraph
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    expect(screen.getByText(text(slice.primary.label))).toBeInTheDocument();
    expect(screen.getByText(asText(slice.primary.content))).toBeInTheDocument();
  });
});
