import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import type { Content, SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import StatsSection from "./index";
import statsSectionModelJson from "./model.json";

function buildSlice() {
  return mockSlice<Content.StatsSectionSlice>(
    statsSectionModelJson as unknown as SharedSliceModel,
  );
}

describe("StatsSection", () => {
  it("only renders stats that have a value", () => {
    const slice = buildSlice();
    const withMissingStat: Content.StatsSectionSlice = {
      ...slice,
      primary: { ...slice.primary, stat_2_value: "" },
    };

    render(
      <StatsSection
        slice={withMissingStat}
        index={0}
        slices={[withMissingStat]}
        context={undefined}
      />,
    );

    expect(
      screen.queryByText(text(withMissingStat.primary.stat_2_label)),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(text(withMissingStat.primary.stat_1_label)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(text(withMissingStat.primary.stat_3_label)),
    ).toBeInTheDocument();
  });

  it("omits the badge row when there are no items", () => {
    const slice = buildSlice();
    const withoutBadges: Content.StatsSectionSlice = { ...slice, items: [] };

    const { container } = render(
      <StatsSection
        slice={withoutBadges}
        index={0}
        slices={[withoutBadges]}
        context={undefined}
      />,
    );

    expect(container.querySelectorAll("img")).toHaveLength(0);
  });
});
