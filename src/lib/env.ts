/**
 * Central place to read environment variables with stable shapes for app code.
 * Next.js loads `.env*` files into `process.env`; see `.env.example` for supported keys.
 */

const TRAILING_SLASH_RE = /\/$/;

/**
 * Strips a trailing slash from a URL or path segment so callers can join paths predictably.
 */
const stripTrailingSlash = (value: string): string =>
  value.replace(TRAILING_SLASH_RE, "");

type PublicEnv = {
  /** Normalized public site origin, or empty string when unset. */
  readonly siteUrl: string;
};

/**
 * Variables safe to use in Client Components (must use the `NEXT_PUBLIC_` prefix in `.env`).
 */
export const getPublicEnv = (): PublicEnv => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  return {
    siteUrl: raw === "" ? "" : stripTrailingSlash(raw),
  };
};

export type ServerEnv = PublicEnv & {
  readonly nodeEnv: string;
  readonly databaseUrl: string | undefined;
  readonly authSecret: string | undefined;
};

/**
 * Server-side configuration including secrets. Do not import this module from Client Components.
 */
export const getServerEnv = (): ServerEnv => {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const authSecret =
    process.env.AUTH_SECRET?.trim() ?? process.env.NEXTAUTH_SECRET?.trim();

  return {
    ...getPublicEnv(),
    nodeEnv: process.env.NODE_ENV ?? "development",
    databaseUrl: databaseUrl === "" ? undefined : databaseUrl,
    authSecret: authSecret === "" ? undefined : authSecret,
  };
};
