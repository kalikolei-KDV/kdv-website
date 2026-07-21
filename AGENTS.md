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
  local visual builder or `npm run slicemachine`. `npm run push-models` (`scripts/push-models.mjs`,
  built on the official `@prismicio/custom-types-client`) replaces the "Push changes" button —
  insert-or-update per model file, slices before custom types (custom types reference slices by
  id). `-- --dry-run` previews without a network call or a write token.
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

If a machine has multiple version managers installed (Volta, nvm, etc.), the _first_ one on `PATH`
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

## The `:uid` page route is conditionally registered

`app/routes.ts` fetches `getAllByType("page")` at build/dev-start time and only registers
`route(":uid", "routes/page.tsx")` when at least one `page` document exists. This isn't optional
niceness — in `ssr: false` mode, any route with a `loader` **must** be covered by at least one
prerendered path (there's no server left to run it otherwise), and `react-router build` hard-fails
if that's violated. Since Prismic `page` documents are the only source of valid `:uid` values and
there may legitimately be zero of them, the route can't unconditionally exist with a `loader`.

Practical effects:

- With zero `page` documents (true today), the route doesn't exist at all — visiting any
  non-`/` path just 404s, and `app/routes/page.tsx` isn't part of the app. This is expected, not
  broken.
- `app/routes/page.tsx` is typed against plain `react-router` types (`LoaderFunctionArgs`,
  `MetaFunction`), not the generated `./+types/page` module — that module only exists when the
  route is registered, so depending on it would make `tsc` fail whenever there are zero pages.
- Once you publish a `page` document and rerun `dev`/`build`/`typegen`, the route appears
  automatically and gets prerendered for every published UID. No code change needed.

There's a second, easy-to-miss consequence of `ssr: false`: **even in `npm run dev`, only paths
listed in `react-router.config.ts`'s `prerender` return real server-rendered content.** Any
registered-but-unlisted route (including a temporary preview route you add for slice verification)
returns HTTP 200 with the generic SPA shell and the default `HydrateFallback` placeholder instead
of its actual content on a plain `curl`/SSR fetch — it only renders once client JS hydrates and
picks up the route. This looks exactly like "the route silently isn't rendering" and is easy to
mistake for a bug in the component. If you add a temporary route (per the slice-verification
workflow below), also temporarily add its path to `prerender`'s return array, and remove both when
done. A genuinely-unregistered path still 404s normally — only _registered_ routes hit this.

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
   slice data. Also add its path to `react-router.config.ts`'s `prerender` array — otherwise
   `npm run dev` + `curl` will show the generic SPA shell instead of real content (see above).
   Restart `dev` after either edit; route/prerender config is read once at startup, not
   hot-reloaded. **Delete the temp route, its `routes.ts` entry, and the `prerender` entry** before
   finishing.
8. Write `app/slices/<Name>/index.test.tsx` (see Testing below) — `mockSlice` generates a fake
   slice value straight from the `model.json` you just wrote, so the test scaffolding costs
   nothing extra to point at a new slice. Cover, at minimum: the component renders without
   throwing, and any conditional-rendering branch it has (an optional field that changes output
   when filled vs. empty, a variant prop, grouped/discriminator-field logic like `OurServices`).
   Run `npm run test`.
9. Run `npm run push-models` (or `-- --dry-run` first to preview) when ready to sync the model to
   the real Prismic repo — this repo's `home`/`page`/`settings` documents won't show new content
   until that happens, and it won't appear on the deployed site until the next build+deploy either
   (fully static, no ISR).

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

## Testing

Vitest + React Testing Library, config in `vitest.config.ts` (deliberately separate from
`vite.config.ts` — the `@react-router/dev/vite` plugin does route-manifest/SSR work Vitest doesn't
need and isn't set up to satisfy; plain `@vitejs/plugin-react` is enough for component tests).

- `npm run test` (single run) / `npm run test:watch` (watch mode).
- Tests are colocated: `app/slices/<Name>/index.test.tsx` next to the component.
- Import `render`/`screen`/etc. from `@/test/render`, not `@testing-library/react` directly —
  slice components render `PrismicLink` (`@/prismic-link`), which forwards to React Router's
  `Link` and needs a Router context even when nothing navigates; `@/test/render` wraps RTL's
  `render` in a `MemoryRouter` for you and re-exports the rest of `@testing-library/react`.
- Use `mockSlice` from `@/test/mock-slice` (built on `@prismicio/mock`, seeded so output is stable
  across runs) to generate a fully-populated fake slice value straight from a slice's own
  `model.json` — no live Prismic content needed. `model.json` is imported as a plain JSON module,
  which widens its string-literal fields (`"type": "SharedSlice"`, etc.) to `string`, so the
  pattern at the call site is:

  ```ts
  const slice = mockSlice<Content.HeroSlice>(
    heroModelJson as unknown as SharedSliceModel,
  );
  ```

  i.e. cast the JSON import to `SharedSliceModel`, and pass the generated `Content.*Slice` type as
  `mockSlice`'s type argument — the same "cast at the boundary" approach used elsewhere in this
  codebase for Prismic's branded union types (see TypeScript gotchas below).

- Use `text()` from `@/test/mock-slice` when passing a Key Text field to an RTL matcher
  (`getByText(text(slice.primary.title))`, etc.). `prismic-ts-codegen` types every Key Text field
  as the generic `KeyTextField` (`string | null`) regardless of whether it's actually optional, but
  RTL's string-only matchers reject `null` — `text()` narrows it and throws if a mocked field is
  ever unexpectedly empty, rather than silently coercing to `""` and passing a meaningless match.
- `app/test/setup.ts` manually calls `cleanup()` in an `afterEach` — RTL's own auto-cleanup hooks
  the _global_ `afterEach`, which never exists here since `vitest.config.ts` doesn't set
  `test.globals` (this repo imports `describe`/`it`/`expect` explicitly). Without it, every
  `render()` in a file piles onto the previous test's DOM instead of replacing it — if a test
  reports being some multiple of the count you expect, check this before the component.
- `app/test/**` and `**/*.test.{ts,tsx}` are exempted from the `react-refresh/only-export-components`
  eslint rule (`eslint.config.mjs`) — they never run through the Vite dev server's React Refresh
  pipeline, so patterns like RTL's documented `export * from "@testing-library/react"` custom-render
  helper don't apply.

## Formatting

Prettier, config in `.prettierrc.json` — `npm run format` (writes) / `npm run format:check` (CI
uses this one). `app/prismicio-types.d.ts` is excluded (`.prettierignore`) since it's regenerated
by `npm run codegen` anyway; reformatting a generated file is pointless busywork.

## SEO: sitemap.xml & robots.txt

- `public/robots.txt` is a static file (just an `Allow: /` + `Sitemap:` pointer) — no reason to
  generate it, it never changes based on content.
- `public/sitemap.xml` **is** generated — `scripts/generate-sitemap.mjs`, chained in front of
  `react-router build` via the `build` npm script (`node scripts/generate-sitemap.mjs &&
react-router build`), reading the same `page`/`case_study` documents
  `react-router.config.ts`'s `prerender()` uses so the sitemap can't drift from what's actually
  prerendered. It's gitignored — it's a build artifact that changes with CMS content, not code, so
  there's nothing worth committing.
- The production domain used for absolute URLs comes from `SITE_URL` (`.env.local`), defaulting to
  `https://kingsmendv.com` if unset.
- Not wired into `npm run dev` — sitemap.xml has no dev-time consumer, only production crawlers.

## Continuous Integration

`.github/workflows/ci.yml` runs on every push to `main` and every PR: `format:check`, `lint`,
`typecheck`, `test`, then `build` (in that order — cheapest checks fail fast first). The `build`
step runs without `PRISMIC_ACCESS_TOKEN`/`PRISMIC_ENVIRONMENT` secrets configured, it still
succeeds — Prismic fetches in `react-router.config.ts`/`app/routes.ts` fall back to empty results
on failure (see above), so an unconfigured build just prerenders zero `page`/`case_study` routes
instead of failing. Add repo secrets with the same names as `.env.local.example` for a CI build
that actually reflects real content.

`.github/dependabot.yml` runs weekly, opening PRs for outdated dependencies — production deps
(`react-router`, `@prismicio/*`, etc.) each get their own PR since those are the ones worth
reviewing individually (this repo has already been bitten twice by Node/`react-router` version
mismatches, see the gotcha above); dev-dependency bumps are grouped into a single PR to cut down on
noise. `ci.yml` runs against every Dependabot PR the same as any other, so a bad bump still gets
caught before merge.

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
