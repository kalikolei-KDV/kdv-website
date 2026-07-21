import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import type { Content, SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import CaseStudyResults from "./index";
import caseStudyResultsModelJson from "./model.json";

describe("CaseStudyResults", () => {
  it("renders every item's value, name, and description", () => {
    const slice = mockSlice<Content.CaseStudyResultsSlice>(
      caseStudyResultsModelJson as unknown as SharedSliceModel,
    );

    render(
      <CaseStudyResults
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    for (const item of slice.items) {
      expect(screen.getByText(text(item.value))).toBeInTheDocument();
      expect(screen.getByText(text(item.name))).toBeInTheDocument();
      expect(screen.getByText(text(item.description))).toBeInTheDocument();
    }
  });
});
