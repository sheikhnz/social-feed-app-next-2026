/**
 * Shared Prisma `select` objects reused across repositories.
 * Keeping them here avoids duplication and makes the author shape consistent
 * across posts and comments.
 */

/** Minimal public author fields safe to expose in API responses. */
export const AUTHOR_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  name: true,
  image: true,
} as const;

/** Shape returned by AUTHOR_SELECT. */
export type AuthorPayload = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  image: string | null;
};
