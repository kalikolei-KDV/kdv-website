import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import type { Content, SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import CaseStudyHeader from "./index";
import caseStudyHeaderModelJson from "./model.json";

describe("CaseStudyHeader", () => {
  it("renders the title in both the desktop and mobile layouts", () => {
    const slice = mockSlice<Content.CaseStudyHeaderSlice>(
      caseStudyHeaderModelJson as unknown as SharedSliceModel,
    );

    render(
      <CaseStudyHeader
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    // Rendered twice — once as the desktop/tablet overlay heading, once as
    // the mobile below-image heading — see the slice's own comment on why
    // there are two <header>-ish layouts rather than one responsive one.
    expect(screen.getAllByText(text(slice.primary.title))).toHaveLength(2);
  });
});
