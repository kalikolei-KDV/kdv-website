import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Vitest's `test.globals` is off (this repo imports `describe`/`it`/`expect`
// explicitly rather than relying on injected globals), so RTL's own
// auto-cleanup — which hooks the global `afterEach` — never registers.
// Without this, each `render()` in a file piles onto the previous test's DOM
// instead of replacing it.
afterEach(() => {
  cleanup();
});
