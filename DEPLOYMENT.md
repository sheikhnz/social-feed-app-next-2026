# Deploying to Vercel

This app is a Next.js App Router project with **Prisma 7**, **PostgreSQL** (via `pg` + driver adapter), and **Auth.js** (Google OAuth + credentials).

## Prerequisites

- A **PostgreSQL** instance reachable from the public internet (for example Neon, Supabase, or RDS with public access). Use a **pooled** connection string for `DATABASE_URL` when your host recommends it (for example Supabase pooler + `?pgbouncer=true` if applicable).
- **Google Cloud Console** OAuth client if you use “Sign in with Google”.

## Vercel project setup

1. Import the Git repository in [Vercel](https://vercel.com/new).
2. Under **Project → Settings → General**, set **Node.js Version** to **24.x** (or newer) to match `package.json` `engines.node`.
3. Vercel will use **pnpm** from the `packageManager` field and the root `pnpm-lock.yaml`.

## Environment variables

Add these under **Project → Settings → Environment Variables**. Enable them for **Production** (and **Preview** if previews should talk to a real database).

| Name                   | Required             | Notes                                                                                                                   |
| ---------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`         | Yes                  | Pooled / app connection string for Prisma + `pg`. Required at **build** time (see `prisma.config.ts`).                  |
| `DIRECT_URL`           | Recommended          | Non-pooled URL for migrations (`prisma migrate deploy` in the Vercel build). If omitted, migrations use `DATABASE_URL`. |
| `AUTH_SECRET`          | Strongly recommended | `openssl rand -base64 32`                                                                                               |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod)           | Full origin, no trailing slash, for example `https://your-app.vercel.app` or your custom domain.                        |
| `AUTH_URL`             | Recommended (prod)   | Same origin as the deployment, for example `https://your-app.vercel.app`. Helps Auth.js behind Vercel.                  |
| `AUTH_GOOGLE_ID`       | If using Google      | From Google Cloud Console                                                                                               |
| `AUTH_GOOGLE_SECRET`   | If using Google      | From Google Cloud Console                                                                                               |

Local reference: [.env.example](.env.example).

## Build command

[`vercel.json`](vercel.json) runs migrations before the normal `pnpm run build`:

1. `prisma migrate deploy` — applies `prisma/migrations` using `DIRECT_URL` or `DATABASE_URL` from `prisma.config.ts`.
2. `pnpm run build` — `prisma generate` + `next build`.

Ensure the database is created and credentials are correct before the first deploy. Preview branches that share a production database will run migrations on preview builds; use a **separate preview database** if you need isolation.

## Google OAuth redirects

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), add **Authorized redirect URIs**:

- `https://<your-deployment-host>/api/auth/callback/google`

Use your production domain or `*.vercel.app` preview URL as needed.

## After deploy

- Open `NEXT_PUBLIC_SITE_URL` in a browser and verify sign-in and API routes.
- If Auth.js redirects misbehave, confirm `AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, and the Google redirect URI all match the live origin.
