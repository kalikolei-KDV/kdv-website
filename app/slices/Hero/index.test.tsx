import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { asText, type Content, type SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice } from "@/test/mock-slice";
import Hero from "./index";
import heroModelJson from "./model.json";

describe("Hero", () => {
  it("renders the heading and CTA from slice content", () => {
    const slice = mockSlice<Content.HeroSlice>(
      heroModelJson as unknown as SharedSliceModel,
    );

    render(
      <Hero slice={slice} index={0} slices={[slice]} context={undefined} />,
    );

    expect(
      screen.getByRole("heading", { name: asText(slice.primary.heading) }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link")).toBeInTheDocument();
  });
});
