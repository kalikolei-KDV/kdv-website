# Figma → Prismic → Next.js Starter

A minimal, working starting point for the pipeline: **Figma components → code → Prismic-driven content → deploy.**

## What's in here

- **Next.js 16** (App Router, TypeScript, Tailwind v4)
- **Prismic** wired up via `@prismicio/client`, `@prismicio/next`, `@prismicio/react`
- **Slice Machine** configured (`slicemachine.config.json`) with one example slice: `Hero`
- Two custom types: `home` (singleton) and `page` (repeatable, uses `/[uid]`)
- Preview + exit-preview API routes for Prismic's live preview
- A homepage that renders gracefully with a placeholder screen until you connect a real Prismic repo

## 1. Create your Prismic repository

1. Go to [prismic.io](https://prismic.io) and create a new repository (any name).
2. Copy that repo name.

## 2. Point this project at it

In `slicemachine.config.json`, replace:
```json
"repositoryName": "your-prismic-repo-name"
```
with your actual repo name.

Then copy the env file and do the same there:
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and set `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` to your repo name.

## 3. Push the content model to Prismic

```bash
npm install
npm run slicemachine
```
This opens the Slice Machine UI (usually at `localhost:9999`). Click **Push changes** to sync the `Hero` slice and the `home`/`page` custom types to your actual Prismic repo. This is a one-time step per model change.

## 4. Add content in Prismic

In the Prismic writing room:
1. Create a `Home` document (it's a singleton — only one exists).
2. Add a `Hero` slice to it, fill in heading/subheading/CTA/image.
3. Publish it.

Run `npm run dev` and you should see it rendered at `localhost:3000`.

## 5. Wire in your Figma-derived components

This is where the Figma MCP workflow plugs in:

1. In Figma, select one component in Dev Mode.
2. Ask your AI coding agent (Claude Code, Cursor, etc., connected via the Figma MCP server) to generate the component.
3. Drop the generated markup into a new slice under `src/slices/<YourSlice>/index.tsx`, matching the pattern in `src/slices/Hero`.
4. Define its fields in `src/slices/<YourSlice>/model.json` (same shape as `Hero`'s).
5. Register it in `src/slices/index.ts` and add it to the relevant custom type's `choices` in `/customtypes`.
6. Run `npm run slicemachine` again to push the new slice model.

Repeat per component — this becomes your repeatable design → content → code loop.

## 6. Deploy

Push this repo to GitHub, then import it into [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Set the same `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` env var in your hosting provider's dashboard. Every push triggers a new deploy; every Prismic publish is picked up on next request (ISR/ on-demand revalidation is already configured in `src/prismicio.ts`).

## Notes

- `src/prismicio-types.d.ts` is currently a **hand-written stub** matching the model above. Once you run Slice Machine against your real repo, it's regenerated automatically to match your actual content model — don't hand-edit it long-term.
- The homepage font is the system font stack by default (no external font fetch at build time). Swap in `next/font/google` or a self-hosted font whenever you're ready.
