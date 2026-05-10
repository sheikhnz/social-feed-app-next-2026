import path from "node:path";

import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

/**
 * Loads env before reading URLs; Prisma 7 CLI uses this file instead of URLs in `schema.prisma`.
 */
loadEnv({ path: path.resolve(process.cwd(), ".env.local") });
loadEnv({ path: path.resolve(process.cwd(), ".env") });

const migrateDatabaseUrl =
  process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();

if (!migrateDatabaseUrl) {
  throw new Error(
    "Set DIRECT_URL (Supabase migrate/direct) or DATABASE_URL in `.env`. See `.env.example`.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    /** Prefer `DIRECT_URL`; otherwise same URL as pooled `DATABASE_URL` (fine for single-host dev). */
    url: migrateDatabaseUrl,
  },
});
