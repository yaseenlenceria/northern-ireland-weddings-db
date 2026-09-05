# Wedlist.ie Ireland Directory

TanStack Start and React directory website for Irish wedding venues, suppliers, wedding fairs, planning tools, and enquiries.

The public directory pages use a Postgres database connection and are prepared for Vercel deployment. The legacy Supabase files remain only for auth/planning-tool areas that have not yet been migrated.

## Vercel Setup

Configure one of these environment variables in Vercel before building Preview or Production:

- `POSTGRES_URL`
- `DATABASE_URL`

Do not commit real `.env` files. Use `.env.example` as the template.

## Database Import

After creating and connecting a Vercel/Neon Postgres database, load the spreadsheet directory data with:

```sh
npm run db:import
```

The importer creates the public directory tables from `db/schema.sql`, then upserts venues, suppliers, wedding fairs, and imported reviews from the local spreadsheet exports.

## Build with Lovable

This project was built with [Lovable](https://lovable.dev).

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f2801c21-49f7-4601-ae40-9518518bbdf5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Migration Status

See `docs/migration-status.md` for the current Laravel-to-Postgres migration status and the remaining blocked source-of-truth mapping work.
