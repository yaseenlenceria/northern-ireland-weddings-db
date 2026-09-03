# Northern Ireland Weddings Directory

TanStack Start and React directory website for Northern Ireland wedding venues, suppliers, wedding fairs, planning tools, and enquiries.

The application currently uses Supabase/Postgres for its database and backend layer and is prepared for Vercel deployment.

## Vercel Setup

Configure these environment variables in Vercel before building Preview or Production:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Do not commit real `.env` files. Use `.env.example` as the template.

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

See `docs/migration-status.md` for the current Laravel-to-Supabase migration status and the remaining blocked source-of-truth mapping work.
