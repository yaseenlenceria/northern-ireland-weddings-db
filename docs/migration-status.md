# Migration Status

## Current Direction

This repository is a TanStack Start and React application backed by Supabase/Postgres. It already contains Supabase client setup, server functions, authentication middleware, generated database types, and a Supabase migration for imported reviews.

The current deployment target is Vercel. Production deployment and production data import are intentionally out of scope until explicitly approved.

## Completed in this branch

- Created a separate Git branch: `codex/vercel-supabase-prep`.
- Removed the tracked `.env` file from Git on this branch.
- Added `.env.example` with required variable names and no secret values.
- Updated `.gitignore` so real environment files are not committed again.
- Replaced deprecated TanStack `createServerFn().inputValidator()` calls with `createServerFn().validator()`.
- Made public directory reads and sitemap generation fail softly when Supabase is not configured, so public pages can still render while Vercel environment variables are being connected.

## Supabase/Postgres Entities Found

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

## Laravel Mapping

Blocked. The Laravel source project and original database export are not available in this repository or workspace, so Laravel models, migrations, validation rules, business logic, and source-to-target field mapping cannot be verified yet.

No Laravel-only fields or business rules have been invented in this branch. When the Laravel project and database export are available, compare them against the current Supabase schema before importing production data.

## Vercel Environment Checklist

Set these variables in Vercel for the relevant environments:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

After removing the tracked `.env`, rotate any value that was previously committed if it is sensitive.

## Data Safety

This branch does not deploy production, does not import production data, and does not modify the original Laravel project or any database export.
