declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Absolute origin for the deployed site (no trailing slash). Used for metadata and public URLs. */
      NEXT_PUBLIC_SITE_URL?: string;
      /** Primary DB URL (use Supabase pooled + ?pgbouncer=true when recommended). */
      DATABASE_URL?: string;
      /** Direct Postgres URL for Prisma Migrate; same as DATABASE_URL if not using a pooler. */
      DIRECT_URL?: string;
      /** Auth.js / NextAuth signing secret (preferred). */
      AUTH_SECRET?: string;
      /** Legacy alias for AUTH_SECRET. */
      NEXTAUTH_SECRET?: string;
      /** Public site URL for Auth.js redirects in some deployments. */
      AUTH_URL?: string;
      /** Legacy alias for AUTH_URL. */
      NEXTAUTH_URL?: string;
    }
  }
}

export {};
