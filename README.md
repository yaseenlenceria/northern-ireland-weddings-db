# WedHQ

Wedding directory for Ireland and the UK (venues, suppliers, planning tools, guides) with a dedicated **SEO services section for wedding businesses** at `/seo`. Built with TanStack Start (SSR), React, Tailwind and Vite, deployed on Vercel.

## Structure

- `src/routes/` — one route per page. Directory pages (suppliers, venues, counties, planning tools, guides) read from Postgres via `src/lib/postgres.server.ts`; taxonomy lives in `src/lib/taxonomy.ts`.
- **`/seo` section** — supplier-facing SEO services: hub, 6 service pages (`src/lib/services.ts`), 14 industry pages (`src/lib/industries.ts`), 12 guides (`src/lib/articles-1.ts` / `articles-2.ts`), free audit, checklist and contact. Lead forms post to `src/lib/leads.functions.ts`, which emails via Resend when `RESEND_API_KEY`, `EMAIL_FROM` and an admin recipient (`WEDHQ_ADMIN_EMAIL` or `CONTACT_EMAIL`) are set.
- `src/lib/seo.ts` — canonical URLs, meta tags, schema helpers. Public origin comes from `VITE_SITE_URL` (default `https://wedhq.co.uk`).
- `src/routes/sitemap[.]xml.ts` — sitemap covering directory hubs/listings (DB-backed), guides, and all `/seo` URLs.

## Development

```sh
npm install --ignore-scripts   # postinstall scripts fail on some machines
npm run build
```

A local production-style server (Node nitro preset):

```sh
NITRO_PRESET=node_server npx vite build
PORT=4173 node .output/server/index.mjs
```

Directory features need the Postgres env vars (`DATABASE_URL` etc.); the `/seo` section works without a database.

## Notes

- The repo is Lovable-connected: never force-push or rebase published history.
- `db/`, `scripts/` and `supabase/` hold data-import tooling for the directory.
- The short-lived standalone Vow Visibility site was merged into `/seo` in commit `1997580`; its content lives on under the WedHQ brand.

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f2801c21-49f7-4601-ae40-9518518bbdf5).
