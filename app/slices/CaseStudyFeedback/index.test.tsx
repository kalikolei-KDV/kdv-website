import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import type { Content, SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import CaseStudyFeedback from "./index";
import caseStudyFeedbackModelJson from "./model.json";

describe("CaseStudyFeedback", () => {
  it("renders the label, quote, name, and description", () => {
    const slice = mockSlice<Content.CaseStudyFeedbackSlice>(
      caseStudyFeedbackModelJson as unknown as SharedSliceModel,
    );

    render(
      <CaseStudyFeedback
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    expect(screen.getByText(text(slice.primary.label))).toBeInTheDocument();
    expect(screen.getByText(text(slice.primary.quote))).toBeInTheDocument();
    expect(screen.getByText(text(slice.primary.name))).toBeInTheDocument();
    expect(
      screen.getByText(text(slice.primary.description)),
    ).toBeInTheDocument();
  });
});
