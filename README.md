# Figma → Prismic → React Router Starter

A minimal, working starting point for the pipeline: **Figma components → code → Prismic-driven content → static deploy.**

## What's in here

- **React Router 8** in framework mode (Vite, TypeScript, Tailwind v4), built with `ssr: false` +
  `prerender` — output is fully static HTML, no runtime server required
- **Prismic** wired up via `@prismicio/client`, `@prismicio/react`; internal links resolve through
  React Router's `Link` (see `app/prismic-link.tsx`)
- **TanStack Query** available (`QueryClientProvider` in `app/root.tsx`) for any future client-side
  data needs — not required for the current all-static content
- Two custom types: `home` (singleton) and `page` (repeatable)
- A `settings` singleton holding global chrome (`Navigation`/`Footer` slices), a CMS-managed
  favicon, and raw head/body script injection (e.g. Google Tag Manager)
- A homepage that renders gracefully with a placeholder screen until you connect a real Prismic repo

## What's different from the Next.js version

This started as a Next.js + Slice Machine site and was migrated to React Router + Vite. A few
things changed along the way:

- **No live preview.** Prismic content is fetched at build time only. To see new content, rebuild
  and redeploy.
- **No local Slice Machine UI.** Slice Machine only ships adapters for Next.js, Nuxt, and
  SvelteKit — there's no React Router adapter. Content models still live as plain JSON
  (`customtypes/*/index.json`, `app/slices/*/model.json`); `npm run push-models` (a thin wrapper
  around Prismic's official Custom Types API client) replaces Slice Machine's "Push changes"
  button.
- **`app/prismicio-types.d.ts` is regenerated, not hand-written.** Run `npm run codegen`
  (`prismic-ts-codegen`) after changing a model — see `prismicCodegen.config.ts`.

## 1. Create your Prismic repository

1. Go to [prismic.io](https://prismic.io) and create a new repository (any name).
2. Copy that repo name.

## 2. Point this project at it

In `slicemachine.config.json`, replace:
```json
"repositoryName": "your-prismic-repo-name"
```
with your actual repo name (this file is just read for that default; it has no other purpose here).

Then copy the env file and do the same there:
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and set `PRISMIC_ENVIRONMENT` to your repo name, plus `PRISMIC_ACCESS_TOKEN` if
your repo requires one. These are only ever read at build time (`react-router build`'s prerender
step) — never shipped to the browser.

## 3. Push the content model to Prismic

There's no local Slice Machine UI for this stack, but the same "push changes" step exists as a
script:

```bash
npm run push-models -- --dry-run   # preview what would be pushed, no network calls
npm run push-models                # actually push (inserts new models, updates existing ones)
```

This reads every `customtypes/*/index.json` and `app/slices/*/model.json` and syncs it to your
repo using `PRISMIC_WRITE_TOKEN` from `.env.local` (see `scripts/push-models.mjs`). Run it any time
you add or change a slice/custom type — same as clicking "Push changes" used to do.

## 4. Add content in Prismic

In the Prismic writing room:
1. Create a `Home` document (it's a singleton — only one exists).
2. Add a `Hero` slice to it, fill in heading/subheading/CTA/image.
3. Publish it.

Run `npm run dev` and you should see it rendered at `localhost:3000` (or whatever port Vite picks).

## 5. Wire in your Figma-derived components

This is where the Figma MCP workflow plugs in:

1. In Figma, select one component in Dev Mode.
2. Ask your AI coding agent (Claude Code, Cursor, etc., connected via the Figma MCP server) to
   generate the component.
3. Drop the generated markup into a new slice under `app/slices/<YourSlice>/index.tsx`, matching
   the pattern in `app/slices/Hero` — use `app/prismic-link.tsx`/`app/prismic-image.tsx` in place
   of `@prismicio/next`'s Next-specific components.
4. Define its fields in `app/slices/<YourSlice>/model.json` (same shape as `Hero`'s).
5. Register it in `app/slices/index.ts` and add it to the relevant custom type's `choices` in
   `/customtypes`.
6. Run `npm run codegen` to regenerate `app/prismicio-types.d.ts`, then `npm run push-models` to
   sync the new/changed models to Prismic.

Repeat per component — this becomes your repeatable design → content → code loop.

## 6. Deploy

`npm run build` produces a fully static site in `build/client/` — deploy it to any static host
(Vercel, Netlify, Cloudflare Pages, S3+CloudFront, GitHub Pages, etc.). There's no server to run.
Every Prismic publish requires a rebuild + redeploy to show up (trigger that via a webhook to your
host's deploy hook, or CI on a schedule).

## Notes

- `app/prismicio-types.d.ts` is **generated** — run `npm run codegen` after any content-model
  change, don't hand-edit it.
- Fonts (Instrument Sans, IBM Plex Mono) are self-hosted via `@fontsource/*`, imported in
  `app/app.css` — no external font requests at runtime.
