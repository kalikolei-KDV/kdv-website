import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Content, SharedSliceModel } from "@prismicio/client";

import { render } from "@/test/render";
import { mockSlice, text } from "@/test/mock-slice";
import Navigation from "./index";
import navigationModelJson from "./model.json";

function buildSlice() {
  return mockSlice<Content.NavigationSlice>(
    navigationModelJson as unknown as SharedSliceModel,
  );
}

describe("Navigation", () => {
  it("toggles the mobile menu open and closed", async () => {
    const slice = buildSlice();
    const user = userEvent.setup();
    const firstLinkLabel = text(slice.items[0].label);

    render(
      <Navigation
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    // The desktop list is always in the DOM (hidden on mobile via CSS only),
    // so the mobile menu's own list is the only thing this toggle adds.
    expect(screen.getAllByRole("link", { name: firstLinkLabel })).toHaveLength(
      1,
    );

    const toggle = screen.getByRole("button", { name: "Menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);

    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getAllByRole("link", { name: firstLinkLabel })).toHaveLength(
      2,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getAllByRole("link", { name: firstLinkLabel })).toHaveLength(
      1,
    );
  });

  it("renders an extra white logo variant when transparent", () => {
    const slice = buildSlice();

    render(
      <Navigation
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
        transparent
      />,
    );

    expect(screen.getAllByAltText("Kingsmen")).toHaveLength(2);
  });

  it("renders only the default logo when not transparent", () => {
    const slice = buildSlice();

    render(
      <Navigation
        slice={slice}
        index={0}
        slices={[slice]}
        context={undefined}
      />,
    );

    expect(screen.getAllByAltText("Kingsmen")).toHaveLength(1);
  });
});
