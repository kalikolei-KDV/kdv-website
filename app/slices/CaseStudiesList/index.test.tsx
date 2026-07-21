import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import type { Content } from "@prismicio/client";

import { render } from "@/test/render";
import CaseStudiesList from "./index";

// Constructing a full PrismicDocument literal for every field this type
// carries (url, lang, tags, first_publication_date, ...) would be pure
// noise here — the component only reads id/uid/data.client/data.title/
// data.meta_image, so build just that and cast at the boundary, matching
// this codebase's convention for Prismic typing friction elsewhere.
function buildCaseStudy(overrides: {
  uid: string;
  client?: string;
  title?: string;
}): Content.CaseStudyDocument {
  return {
    id: overrides.uid,
    uid: overrides.uid,
    data: {
      client: overrides.client ?? "",
      title: overrides.title ?? "",
      meta_image: {},
    },
  } as unknown as Content.CaseStudyDocument;
}

function buildSlice(): Content.CaseStudiesListSlice {
  return {
    slice_type: "case_studies_list",
    slice_label: null,
    id: "test-case-studies-list",
    variation: "default",
    version: "sktwi1xtmkfgx8626",
    primary: {},
    items: [],
  } as unknown as Content.CaseStudiesListSlice;
}

describe("CaseStudiesList", () => {
  it("renders every case study, each linking to its own page", () => {
    const slice = buildSlice();
    const caseStudies = [
      buildCaseStudy({ uid: "evolus", client: "Evolus", title: "Growth 99" }),
      buildCaseStudy({
        uid: "merz",
        client: "Merz Aesthetics",
        title: "Split Signal",
      }),
    ];

    const { container } = render(
      <CaseStudiesList
        slice={slice}
        index={0}
        slices={[slice]}
        context={{ caseStudies }}
      />,
    );

    expect(screen.getByText("Evolus")).toBeInTheDocument();
    expect(screen.getByText("Growth 99")).toBeInTheDocument();
    expect(screen.getByText("Merz Aesthetics")).toBeInTheDocument();
    expect(screen.getByText("Split Signal")).toBeInTheDocument();
    // Both the content panel and the image are separately clickable
    // through to the same case study.
    expect(
      container.querySelectorAll('a[href="/case-studies/evolus"]'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('a[href="/case-studies/merz"]'),
    ).toHaveLength(2);
  });

  it("omits the client label when a case study has no client set", () => {
    const slice = buildSlice();
    const caseStudies = [
      buildCaseStudy({ uid: "no-client", title: "Untitled Project" }),
    ];

    const { container } = render(
      <CaseStudiesList
        slice={slice}
        index={0}
        slices={[slice]}
        context={{ caseStudies }}
      />,
    );

    const paragraphs = container.querySelectorAll("li p");
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0]).toHaveTextContent("Untitled Project");
  });
});
