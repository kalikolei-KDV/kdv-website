# Kingsmen Digital Ventures — website

Marketing site built by translating a Figma file section-by-section into Prismic-driven content:
**Figma components → code → Prismic content → static deploy.**

## What's in here

- **React Router 8** in framework mode (Vite, TypeScript, Tailwind v4), built with `ssr: false` +
  `prerender` — output is fully static HTML, no runtime server required
- **Prismic** wired up via `@prismicio/client`, `@prismicio/react`; internal links resolve through
  React Router's `Link` (see `app/prismic-link.tsx`, `app/prismic-image.tsx`)
- **TanStack Query** available (`QueryClientProvider` in `app/root.tsx`) for any future client-side
  data needs — not required by the current all-static content
- Three page-producing custom types: `home` (singleton), `page` (repeatable, generic pages), and
  `case_study` (repeatable, the case-study template)
- A `settings` singleton holding global chrome (`Navigation`/`Footer` slices), a CMS-managed
  favicon, and raw head/body script injection (e.g. Google Tag Manager)
- 16 slices under `app/slices/` — homepage sections (`Hero`, `ThreeCards`, `DeliveryTitleCta`,
  `OurServices`, `Industries`, `StatsSection`, `ConnectWithUs`), global chrome (`Navigation`,
  `Footer`), and the case-study template (`CaseStudyHeader`, `CaseStudyMeta`, `TwoColumnCopy`,
  `CaseStudyGallery`, `TitledParagraph`, `CaseStudyResults`, `CaseStudyFeedback`)
- A homepage that renders gracefully with a placeholder screen until you connect a real Prismic repo

## Content architecture

- `/` renders the `home` singleton's slice zone.
- `/:uid` renders a `page` document — but **only exists once at least one `page` document is
  published**. In `ssr: false` mode, a route with a `loader` must be covered by a prerendered path
  or the build fails, so `app/routes.ts` checks Prismic at startup and only registers the route
  when there's something for it to serve. Same for `/case-studies/:uid` and `case_study`
  documents. No code change needed once you publish one — just restart `dev` or rebuild.
- Global chrome (`Navigation`, `Footer`, favicon, tracking scripts) lives in the `settings`
  singleton and is fetched once in `app/root.tsx`'s root loader, not through any page's slice zone.
- The case-study template's nav is the _same_ `Navigation` slice as everywhere else, just
  reskinned transparent/white-on-image at `md+` — controlled by the route itself via
  `export const handle = { transparentNav: true }`, read in `app/root.tsx` with `useMatches()`. Not
  a second nav baked into the header slice (that produced a visible duplicate — see AGENTS.md).

## Setup

### 1. Point this project at your Prismic repository

In `slicemachine.config.json`, set `repositoryName` to your repo's name (this file is only read
for that default; it has no other purpose here). Then:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`: `PRISMIC_ENVIRONMENT` (your repo name) and `PRISMIC_ACCESS_TOKEN` if your repo
requires one for read access. Both are only ever read at build/dev-start time (Node), never
shipped to the browser.

### 2. Install and run

```bash
npm install   # requires Node >=22.22.0 — see the "Node version" note below
npm run dev
```

### 3. Push the content model

There's no local Slice Machine UI for this stack (no React Router adapter exists), but the same
"push changes" step exists as a script, built on Prismic's official Custom Types API client:

```bash
npm run push-models -- --dry-run   # preview what would be pushed, no network call
npm run push-models                # actually push (inserts new models, updates existing ones)
```

Reads every `customtypes/*/index.json` and `app/slices/*/model.json` and syncs it to your repo
using `PRISMIC_WRITE_TOKEN`. Run it any time you add or change a slice/custom type.

### 4. Add content in Prismic

Create and publish a `Home` document (singleton), add slices to it, then `npm run dev` and visit
`localhost:3000` (or whatever port Vite picks). For a `page` or `case_study` document: publish it,
then restart `dev` (route registration happens once at startup — see Content architecture above).

## Wire in a new slice from Figma

1. Pull `get_design_context` (Figma MCP) for the relevant node(s) — check every breakpoint that
   has structural differences, not just size differences.
2. Build the slice under `app/slices/<Name>/index.tsx`, matching an existing slice's shape
   (`FC<SliceComponentProps<...>>`, this repo's `PrismicLink`/`PrismicImage` for links/images,
   `PrismicRichText` for rich text fields).
3. Write `app/slices/<Name>/model.json`.
4. Run `npm run codegen` to regenerate `app/prismicio-types.d.ts`.
5. Register it in `app/slices/index.ts` and add it as a choice in the relevant
   `customtypes/*/index.json`.
6. `npx tsc --noEmit` / `npx eslint <changed paths>`.
7. Visually verify: add a temporary route rendering it with mock data, **and add that route's path
   to `react-router.config.ts`'s `prerender` array** — otherwise `npm run dev` serves the generic
   SPA shell instead of real content for it (an `ssr: false` quirk, see AGENTS.md). Delete both
   the temp route and the `prerender` entry when done.
8. Write `app/slices/<Name>/index.test.tsx` using `mockSlice`/`@/test/render` (see AGENTS.md's
   Testing section) and run `npm run test`.
9. `npm run push-models` to sync the new model to Prismic.

## Deploy

`npm run build` produces a fully static site in `build/client/` — deploy it to any static host
(Vercel, Netlify, Cloudflare Pages, S3+CloudFront, GitHub Pages, etc.). There's no server to run.
Every Prismic publish requires a rebuild + redeploy to show up (trigger that via a webhook to your
host's deploy hook, or CI on a schedule) — there's no live preview or ISR in this architecture.

## Node version

Pinned via Volta (`package.json`) and `.nvmrc` to a version satisfying `react-router`'s own
minimum (currently 22.22.0+). This isn't cosmetic: running the CLI on an older Node doesn't just
warn, it corrupts `node_modules` — see AGENTS.md before troubleshooting install issues.

## Notes

- `app/prismicio-types.d.ts` is **generated** — run `npm run codegen` after any content-model
  change, don't hand-edit it.
- Fonts (Instrument Sans, IBM Plex Mono) are self-hosted via `@fontsource/*`, imported in
  `app/app.css` — no external font requests at runtime.
- See `AGENTS.md` for the deeper conventions/gotchas list (styling patterns, TypeScript quirks
  specific to this stack, process hygiene when spinning up temp dev servers).
