# Local development and publishing

The working copy is `C:\Users\Seenu\Desktop\Wedding side data\northern-ireland-weddings-db`.
The sibling `database-export` folder is a private data export, not application source.

1. Run `npm run sync` before starting work. It pulls without rewriting history and refuses to overwrite uncommitted changes.
2. Install dependencies with `npm ci --ignore-scripts` after dependency changes.
3. Copy `.env.example` to `.env.local` and supply local connection values. Environment files stay out of Git. Set `VITE_NEON_AUTH_URL` to enable sign-in; the server-only `NEON_AUTH_BASE_URL` is not exposed to the browser.
4. Run `npm run dev` and open the URL Vite prints.
5. Publish named files with `npm run ship -- "Describe the change" src/path/to/file.tsx`. This checks the remote, builds, stages only the named files, commits, and pushes the current branch. It stops on failure. Review with `git diff` first.

Pushes to `main` are connected to Vercel production and Lovable. Other branches can be used for preview changes. Never force-push or rewrite published commits.

The database export contains JSON rows and schema metadata. It is not a SQL restore archive. Do not run the import/schema scripts against production unless intentionally changing production data.
