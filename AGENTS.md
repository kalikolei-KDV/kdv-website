# Kingsmen Digital Ventures — website

React Router 8 (framework mode, `ssr: false` + `prerender` → fully static output) + Prismic
marketing site, built by translating a Figma file section-by-section into Prismic shared slices.
For project setup (env vars, pushing content models, deploying), see `README.md` — this file
covers conventions for anyone (human or agent) adding to the codebase.

This project was migrated from a Next.js App Router version — if you see stale references to
`src/app`, `next.config.ts`, `@prismicio/next`, or `npm run slicemachine` anywhere outside git
history, they're leftovers to clean up, not intentional.

## Stack

- React Router 8, Vite, TypeScript, React 19 — `ssr: false` in `react-router.config.ts`, every
  route prerendered to static HTML at build time. No runtime server, no live preview.
- Tailwind CSS v4 via `@tailwindcss/vite` (`@theme inline` tokens in `app/app.css`)
- Prismic via `@prismicio/client`, `@prismicio/react`. `app/prismic-link.tsx` and
  `app/prismic-image.tsx` are the framework-agnostic replacements for `@prismicio/next`'s
  `PrismicNextLink`/`PrismicNextImage` (which don't exist outside Next) — use those, not raw
  `@prismicio/react` `PrismicLink`, in slice components.
- TanStack Query (`QueryClientProvider` in `app/root.tsx`) — available for future client-side data
  needs, not required by the current all-static content.
- Fonts: Instrument Sans (`--font-heading`) and IBM Plex Mono (`--font-body`), self-hosted via
  `@fontsource/*`, imported in `app/app.css`.
- Content models are plain JSON (`customtypes/*/index.json`, `app/slices/*/model.json`) — there is
  **no Slice Machine adapter for React Router** (only Next.js/Nuxt/SvelteKit exist), so there's no
  local visual builder or `npm run slicemachine`. Push models to Prismic via their web UI or
  migration API instead.
- `app/prismicio-types.d.ts` is **generated**, not hand-written — run `npm run codegen`
  (`prismic-ts-codegen`, configured in `prismicCodegen.config.ts`) after any model change. Don't
  hand-edit it.

## Environment / Node version gotcha

This repo is pinned (`volta` field in `package.json`, `.nvmrc`) to a Node version that satisfies
`react-router`'s hard runtime requirement (currently >=22.22.0 — check the actual installed
`react-router`/`@react-router/dev` version's own engines field, it moves). This isn't a soft
warning: running the CLI (`typegen`, `dev`, `build`) on an older Node triggers a broken "self-heal"
path that silently prunes most of `node_modules` and mutates `package.json` (adds `isbot`) before
crashing. If you ever see a run print `removed N packages` or `adding 'isbot' to your package.json`
unprompted, stop, check `node --version` against the CLI's real requirement, and reinstall clean
rather than re-running the same command.

If a machine has multiple version managers installed (Volta, nvm, etc.), the *first* one on `PATH`
wins regardless of what any of the others think is active — `which -a node` to check before
assuming a `nvm use`/`volta pin` actually took effect.

## Content architecture

- `customtypes/home` and `customtypes/page` hold the per-page slice zone.
- `customtypes/settings` is a singleton that holds **global chrome** — the `Navigation` and
  `Footer` slices, a CMS-managed `favicon` image, and raw head/body script fields (e.g. Google Tag
  Manager). None of this is rendered through a page's `SliceZone`; it's all fetched in
  `app/root.tsx`'s root `loader` and rendered in the `Layout` export (accessed via
  `useRouteLoaderData("root")`, not `useLoaderData()` — `Layout` also renders during error states
  where the current route's own loader didn't run).
- Prismic slices can't nest a repeatable group inside a slice's `items` zone (items is already
  implicitly a group). Where a section needs grouped repeatable content (e.g. `OurServices`'
  category lists), the convention here is a flat `items` array with a discriminator field
  (`category`), grouped by run-length in the component — see `app/slices/OurServices/index.tsx`.
- Head/body script injection (`app/root.tsx`): `head_scripts` expects **bare inline JS** (a
  wrapping `<script>...</script>` pair is stripped automatically if present, so pasting a full
  GTM snippet still works); `body_start_scripts`/`body_end_scripts` expect **full raw HTML**
  (e.g. GTM's `<noscript><iframe>` snippet) and are inserted via `dangerouslySetInnerHTML`. This
  split exists because `<head>` can't hold arbitrary non-metadata children the way `<body>` can.

## Adding a slice from Figma

This repo's actual workflow, repeated per section:

1. Pull `get_design_context` (Figma MCP) for the relevant node(s) — usually one per breakpoint
   that has structural differences, not just size differences. Don't assume; check.
2. Convert the generated Tailwind/React into a Prismic slice under `app/slices/<Name>/`, matching
   `app/slices/Hero`'s shape (`FC<SliceComponentProps<...>>`, this repo's own
   `PrismicLink`/`PrismicImage` for links/images, `PrismicRichText` for rich text fields).
3. Write `app/slices/<Name>/model.json`.
4. Run `npm run codegen` to regenerate `app/prismicio-types.d.ts`.
5. Register it in `app/slices/index.ts` and add it as a `SharedSlice` choice in the relevant
   `customtypes/*/index.json`.
6. Run `npx tsc --noEmit` and `npx eslint <changed paths>`.
7. Visually verify: this repo has no slice-simulator route set up, so spin up a temporary route
   (e.g. `app/routes/preview-x.tsx`, added to `app/routes.ts`) rendering the component with mock
   slice data, hit it with `npm run dev` + `curl`, then **delete the temp route and its
   `routes.ts` entry** before finishing.
8. Push the model to the real Prismic repo (writing room UI or migration API) when ready — this
   repo's `home`/`page`/`settings` documents won't show new content until that happens, and it
   won't appear on the deployed site until the next build+deploy either (fully static, no ISR).

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

## TypeScript gotchas specific to this stack

- `tsconfig.json` has `verbatimModuleSyntax: true` — type-only imports (`FC`, `Content`,
  `SliceComponentProps`, etc.) must use `import type`, or `tsc` fails on that alone.
- `@prismicio/react`'s `PrismicLink` expects its `internalComponent` to accept an `href` prop
  (matching `<a>`); React Router's `Link` uses `to` instead. `app/prismic-link.tsx` adapts between
  them — don't drop React Router's `Link` in directly as `internalComponent`.
- React Router's `useRouteLoaderData<typeof loader>()` / `SerializeFrom` type utility does not
  reliably preserve Prismic's branded discriminated-union slice types (`NavigationSlice |
  FooterSlice` collapses instead of narrowing per-field). `app/root.tsx` works around this with an
  explicit `Awaited<ReturnType<typeof loader>>` type alias and a manual cast rather than relying on
  the generic. If you hit a similar "type X is not assignable to type Y" error where X and Y are
  both members of the same slice union, this is almost certainly the same issue — don't spend time
  trying to fix the predicate/narrowing logic itself, cast at that boundary instead.

## Process hygiene

When starting a dev server for verification, capture the exact PID you spawned and kill only
that PID when done — a broad `pkill -f "react-router dev"` can take down a server someone else
already had running.
