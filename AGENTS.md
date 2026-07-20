# Kingsmen Digital Ventures — website

Next.js 15 (App Router) + Prismic (Slice Machine) marketing site, built by translating a Figma
file section-by-section into Prismic shared slices. For project setup (env vars, pushing content
models, deploying), see `README.md` — this file covers conventions for anyone (human or agent)
adding to the codebase.

## Stack

- Next.js 15, App Router, TypeScript, React 19
- Tailwind CSS v4 (`@theme inline` tokens in `src/app/globals.css`)
- Prismic via `@prismicio/client`, `@prismicio/next`, `@prismicio/react`, content modeled with
  Slice Machine (`slicemachine.config.json`, `customtypes/`)
- Fonts: Instrument Sans (`--font-heading`) and IBM Plex Mono (`--font-body`), loaded via
  `next/font/google` in `src/app/layout.tsx`

There is nothing unusual about the installed Next.js version — standard App Router APIs and
conventions apply. If you need framework reference material, use the official docs at
nextjs.org/docs, not a local path.

## Content architecture

- `customtypes/home` and `customtypes/page` hold the per-page slice zone.
- `customtypes/settings` is a singleton that holds **global chrome** — the `Navigation` and
  `Footer` slices. These are *not* rendered through a page's `SliceZone`; they're fetched and
  rendered directly in `src/app/layout.tsx`, above/below `{children}`.
- `src/prismicio-types.d.ts` is **hand-maintained** in this repo, not auto-generated — there's no
  running Slice Machine dev server keeping it in sync. When you add or change a slice, update its
  types here too, following the existing per-slice pattern (`XSliceDefaultPrimary`,
  `XSliceDefaultItem`, `XSliceDefault`, `XSlice`, plus the `HomeDocumentDataSlicesSlice` /
  `PageDocumentDataSlicesSlice` unions and the `Content` module exports at the bottom).
- Prismic slices can't nest a repeatable group inside a slice's `items` zone (items is already
  implicitly a group). Where a section needs grouped repeatable content (e.g. `OurServices`'
  category lists), the convention here is a flat `items` array with a discriminator field
  (`category`), grouped by run-length in the component — see `src/slices/OurServices/index.tsx`.

## Adding a slice from Figma

This repo's actual workflow, repeated per section:

1. Pull `get_design_context` (Figma MCP) for the relevant node(s) — usually one per breakpoint
   that has structural differences, not just size differences. Don't assume; check.
2. Convert the generated Tailwind/React into a Prismic slice under `src/slices/<Name>/`, matching
   `src/slices/Hero`'s shape (`FC<SliceComponentProps<...>>`, `PrismicNextLink`/`PrismicNextImage`
   for links/images, `PrismicRichText` for rich text fields).
3. Write `src/slices/<Name>/model.json`.
4. Add the slice's types to `src/prismicio-types.d.ts` by hand (see above).
5. Register it in `src/slices/index.ts` and add it as a `SharedSlice` choice in the relevant
   `customtypes/*/index.json`.
6. Run `npx tsc --noEmit` and `npx eslint <changed paths>`.
7. Visually verify: this repo has no slice-simulator route set up, so spin up a temporary route
   (e.g. `src/app/preview-x/page.tsx`) rendering the component with mock slice data, hit it with
   `npm run dev` + `curl`, then **delete the temp route** before finishing.
8. Push the model to the real Prismic repo with `npm run slicemachine` when ready (this repo's
   `home`/`page`/`settings` documents won't show new content until that happens).

### Styling conventions

- Tailwind arbitrary values are used to match Figma's exact pixel values (spacing, font sizes,
  tracking) rather than snapping to a design-token scale — intentional 1:1 fidelity with the
  source design, matching the existing Hero/Footer slices.
- Colors/paragraph styles from Figma variables map to CSS custom properties with literal hex
  fallbacks, e.g. `text-[color:var(--paragraph-primary,#422307)]`. Reuse the same variable names
  Figma exposes rather than inventing new ones.
- Breakpoints: check the actual Tablet frame in Figma before assuming a layout switches at `md`
  (768px) or `lg` (1024px) — sections in this file are inconsistent (e.g. `DeliveryTitleCta` goes
  to a row layout at `md`, but `OurServices`/`Industries`/`StatsSection` stay stacked until `lg`
  even though their category/stat grids switch to 2-column at `md`).
- Mobile-only horizontal scroll (`overflow-x-auto` + fixed-width children) is used for card rows
  and badge rows that would otherwise wrap awkwardly at narrow widths (`ThreeCards`,
  `StatsSection`'s awards row).

## Process hygiene

When starting a dev server for verification, capture the exact PID you spawned and kill only
that PID when done — a broad `pkill -f "next dev"` can take down a server someone else already
had running.
