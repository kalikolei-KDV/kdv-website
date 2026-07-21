import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import type { Content, SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import CaseStudyMeta from "./index";
import caseStudyMetaModelJson from "./model.json";

describe("CaseStudyMeta", () => {
  it("renders every item's label/value pair", () => {
    const slice = mockSlice<Content.CaseStudyMetaSlice>(
      caseStudyMetaModelJson as unknown as SharedSliceModel,
    );

    render(
      <CaseStudyMeta
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    for (const item of slice.items) {
      expect(screen.getByText(text(item.label))).toBeInTheDocument();
      expect(screen.getByText(text(item.value))).toBeInTheDocument();
    }
  });
});
