declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Absolute origin for the deployed site (no trailing slash). Used for metadata and public URLs. */
      NEXT_PUBLIC_SITE_URL?: string;
      /** Public Cloudinary cloud name (safe for client-side upload widgets). */
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string;
      /** Server-only database connection string. Never use the NEXT_PUBLIC_ prefix for secrets. */
      DATABASE_URL?: string;
      /** Auth.js / NextAuth signing secret (preferred). */
      AUTH_SECRET?: string;
      /** Legacy alias for AUTH_SECRET. */
      NEXTAUTH_SECRET?: string;
      /** Public site URL for Auth.js redirects in some deployments. */
      AUTH_URL?: string;
      /** Legacy alias for AUTH_URL. */
      NEXTAUTH_URL?: string;
      /** Cloudinary API key (server-only). */
      CLOUDINARY_API_KEY?: string;
      /** Cloudinary API secret (server-only). */
      CLOUDINARY_API_SECRET?: string;
    }
  }
}

export {};
