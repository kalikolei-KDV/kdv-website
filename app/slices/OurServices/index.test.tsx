import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import type { Content } from "@prismicio/client";

import { render } from "@/test/render";
import OurServices from "./index";

/**
 * `groupByCategory` merges by run-length, not by value — items sharing a
 * category only fold into one group if they're adjacent in the flat `items`
 * array (see AGENTS.md's "Content architecture" note on why this pattern
 * exists at all). That run-length behavior, not just "does it render text",
 * is the thing worth testing here.
 */
function buildSlice(
  items: Content.OurServicesSliceDefaultItem[],
): Content.OurServicesSlice {
  return {
    slice_type: "our_services",
    slice_label: null,
    id: "test-our-services",
    variation: "default",
    version: "sktwi1xtmkfgx8626",
    primary: {
      title: "Our Services",
      cta_label: "",
      cta_link: { link_type: "Any" },
    },
    items,
  };
}

describe("OurServices", () => {
  it("merges adjacent items sharing a category into one group", () => {
    const slice = buildSlice([
      { category: "Discovery", label: "Research" },
      { category: "Discovery", label: "Audits" },
      { category: "Build", label: "Design systems" },
    ]);

    render(
      <OurServices
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    expect(screen.getAllByText("Discovery")).toHaveLength(1);
    expect(screen.getAllByText("Build")).toHaveLength(1);
    expect(screen.getByText("Research")).toBeInTheDocument();
    expect(screen.getByText("Audits")).toBeInTheDocument();
  });

  it("keeps non-adjacent items with the same category as separate groups", () => {
    const slice = buildSlice([
      { category: "Discovery", label: "Research" },
      { category: "Build", label: "Design systems" },
      { category: "Discovery", label: "Audits" },
    ]);

    render(
      <OurServices
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    expect(screen.getAllByText("Discovery")).toHaveLength(2);
  });
});
