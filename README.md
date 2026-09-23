# Vow Visibility

Marketing & SEO website for Irish wedding businesses. Built with TanStack Start (SSR), React, Tailwind and Vite, deployed on Vercel.

The site is fully static in content (no database): routes, SEO metadata, sitemap and lead forms are all handled in `src/`.

## Structure

- `src/routes/` — one route per page. Industry pages render from `src/lib/industries.ts`, service pages from `src/lib/services.ts`, resource articles from `src/lib/articles-1.ts` / `articles-2.ts`.
- `src/lib/seo.ts` — canonical URLs, meta tags, JSON-LD helpers. The public origin comes from `VITE_SITE_URL` (default `https://vowvisibility.com`).
- `src/lib/leads.functions.ts` — server function behind the audit / checklist / contact forms. Submissions are logged and emailed via Resend when `RESEND_API_KEY`, `EMAIL_FROM` and an admin recipient (`VOW_ADMIN_EMAIL` or `CONTACT_EMAIL`) are configured.
- `src/routes/sitemap[.]xml.ts` — sitemap of all 39 URLs.

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

## Notes

- The repo is Lovable-connected: never force-push or rebase published history.
- The former WedHQ directory code lives in git history; `db/`, `supabase/` and `scripts/` are unused by this site.

## Build with Lovable

This project was built with [Lovable](https://lovable.dev).

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f2801c21-49f7-4601-ae40-9518518bbdf5).
