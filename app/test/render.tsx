import type { ReactElement } from "react";
import { render as rtlRender } from "@testing-library/react";
import { MemoryRouter } from "react-router";

/**
 * Slice components render `PrismicLink` (`@/prismic-link`), which forwards to
 * React Router's `Link` — that requires a Router context to be present even
 * in tests that never navigate.
 */
export function render(ui: ReactElement) {
  return rtlRender(ui, { wrapper: MemoryRouter });
}

export * from "@testing-library/react";
