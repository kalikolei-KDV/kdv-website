import { describe, expect, it } from "vitest";
import type { Content, SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice } from "@/test/mock-slice";
import CaseStudyGallery from "./index";
import caseStudyGalleryModelJson from "./model.json";

describe("CaseStudyGallery", () => {
  it("renders one image per item", () => {
    const slice = mockSlice<Content.CaseStudyGallerySlice>(
      caseStudyGalleryModelJson as unknown as SharedSliceModel,
    );

    const { container } = render(
      <CaseStudyGallery
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    expect(container.querySelectorAll("img")).toHaveLength(slice.items.length);
  });

  it("skips items whose image is empty", () => {
    const slice = mockSlice<Content.CaseStudyGallerySlice>(
      caseStudyGalleryModelJson as unknown as SharedSliceModel,
    );
    const [firstItem, ...restItems] = slice.items;
    const withEmptyImage: Content.CaseStudyGallerySlice = {
      ...slice,
      items: [{ ...firstItem, image: {} }, ...restItems],
    };

    const { container } = render(
      <CaseStudyGallery
        slice={withEmptyImage}
        index={0}
        slices={[withEmptyImage]}
        context={undefined}
      />,
    );

    expect(container.querySelectorAll("img")).toHaveLength(
      withEmptyImage.items.length - 1,
    );
  });
});
