import { createMockFactory } from "@prismicio/mock";
import type * as prismic from "@prismicio/client";

// Fixed seed so mock field values (rich text, images, links, etc.) are
// identical on every test run instead of changing on each execution.
const mockFactory = createMockFactory({ seed: "kdv-website" });

/**
 * Builds a fully-populated fake value for a shared slice, straight from its
 * `model.json`, for use as a slice component's `slice` prop in tests — no
 * live Prismic content needed.
 *
 * `model.json` is imported as a plain JSON module, which widens its string
 * literal fields (e.g. `"type": "SharedSlice"`) to `string` — cast the
 * import to `SharedSliceModel` at the call site and pass the generated
 * `Content.*Slice` type as this function's type argument.
 */
export function mockSlice<Slice extends prismic.Slice>(
  model: prismic.SharedSliceModel,
): Slice {
  return mockFactory.value.sharedSlice({ model }) as unknown as Slice;
}

/**
 * `prismic-ts-codegen` types every Key Text field as the generic
 * `KeyTextField` (`string | null`) regardless of whether it's actually
 * required — it doesn't narrow by field state. `mockSlice` always fills
 * every field, so a `null` here means the assumption broke, not that the
 * field is legitimately optional; throw instead of silently coercing to `""`
 * so that shows up as a clear failure rather than a confusing empty match.
 */
export function text(field: string | null | undefined): string {
  if (field == null) {
    throw new Error("Expected a filled KeyTextField in a mocked slice.");
  }
  return field;
}
