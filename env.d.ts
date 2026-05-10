declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Absolute origin for the deployed site (no trailing slash). Used for metadata and public URLs. */
      NEXT_PUBLIC_SITE_URL?: string;
      /** Server-only database connection string. Never use the NEXT_PUBLIC_ prefix for secrets. */
      DATABASE_URL?: string;
    }
  }
}

export {};
