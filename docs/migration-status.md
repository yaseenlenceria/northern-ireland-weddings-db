# Migration Status

## Current Direction

This repository is a TanStack Start and React application being moved off Supabase for public directory data. Public directory reads now use a standard Postgres connection so the app can run against Vercel/Neon Postgres. Legacy Supabase client files remain for auth, enquiries, saved items, and planning-tool pages that have not yet been migrated.

The current deployment target is Vercel.

## Completed in this branch

- Created a separate Git branch: `codex/vercel-supabase-prep`.
- Removed the tracked `.env` file from Git on this branch.
- Added `.env.example` with required variable names and no secret values.
- Updated `.gitignore` so real environment files are not committed again.
- Replaced deprecated TanStack `createServerFn().inputValidator()` calls with `createServerFn().validator()`.
- Made public directory reads and sitemap generation fail softly when Supabase is not configured, so public pages can still render while Vercel environment variables are being connected.
- Added a Postgres schema for public directory tables in `db/schema.sql`.
- Rewired public directory server functions to read from `POSTGRES_URL` or `DATABASE_URL`.
- Added spreadsheet import tooling for venues, suppliers, wedding fairs, and imported reviews.

## Directory Entities Found

The repository currently references these main directory entities through generated Supabase types and app code:

- `venues`
- `suppliers`
- `reviews`
- `imported_reviews`
- `enquiries`
- `saved_items`
- `profiles`
- `user_roles`
- `wedding_fairs`
- `budget_items`
- `checklist_items`
- `guest_list`

## Spreadsheet Import Mapping

The local spreadsheet exports map into:

- `venues`: 394 deduplicated rows
- `suppliers`: 780 deduplicated rows
- `wedding_fairs`: 19 rows
- `imported_reviews`: 200 rows

Run `npm run db:import` after Vercel/Neon Postgres has been created and the local environment contains `POSTGRES_URL` or `DATABASE_URL`.

## Laravel Mapping

Blocked. The Laravel source project and original database export are not available in this repository or workspace, so Laravel models, migrations, validation rules, business logic, and source-to-target field mapping cannot be verified yet.

No Laravel-only fields or business rules have been invented in this branch. When the Laravel project and database export are available, compare them against the Postgres schema before importing production data.

## Vercel Environment Checklist

Set one of these variables in Vercel for the relevant environments:

- `POSTGRES_URL`
- `DATABASE_URL`

Legacy Supabase variables are only needed while auth/planning-tool pages still use Supabase.

After removing the tracked `.env`, rotate any value that was previously committed if it is sensitive.

## Data Safety

The importer reads local spreadsheet exports and upserts into the configured Postgres database. It does not modify the original Laravel project or any source spreadsheet.
