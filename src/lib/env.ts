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

/**
 * Cloudinary credentials for signed direct uploads (server-only secret).
 * Public delivery URLs use https://res.cloudinary.com/<cloud_name>/...
 */
export type CloudinaryServerEnv = {
  readonly cloudName: string;
  readonly apiKey: string;
  readonly apiSecret: string;
  /** Root folder segment under each user's uploads (e.g. social-feed/posts → …/posts/<userId>). */
  readonly uploadFolderPrefix: string;
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

const DEFAULT_CLOUDINARY_FOLDER = "social-feed/posts";

/**
 * Returns Cloudinary configuration when all required vars are set; otherwise null.
 * Used by signed upload and post image URL verification.
 */
export const getCloudinaryEnv = (): CloudinaryServerEnv | null => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? "";
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim() ?? "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() ?? "";
  const folder =
    process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() ?? DEFAULT_CLOUDINARY_FOLDER;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    uploadFolderPrefix: folder.replace(/^\/+|\/+$/g, ""),
  };
};
