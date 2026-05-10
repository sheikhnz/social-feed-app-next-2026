const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

/** Encodes a UUID as a URL-safe base64 cursor. */
export const encodeCursor = (id: string): string =>
  Buffer.from(id).toString("base64url");

/**
 * Decodes a cursor back to a UUID.
 * Throws if the value is not a valid UUID — caller should surface as 400.
 */
export const decodeCursor = (cursor: string): string => {
  const decoded = Buffer.from(cursor, "base64url").toString("utf8");
  if (!UUID_RE.test(decoded)) throw new Error("Invalid cursor");
  return decoded;
};

/**
 * Builds a paginated result from a list that was fetched with `limit + 1`.
 * The extra item is used to detect whether more pages exist.
 */
export const buildPaginatedResult = <T extends { id: string }>(
  items: T[],
  limit: number,
): PaginatedResult<T> => {
  const hasMore = items.length > limit;
  const sliced = hasMore ? items.slice(0, limit) : items;
  const last = sliced.at(-1);
  return {
    items: sliced,
    nextCursor: hasMore && last ? encodeCursor(last.id) : null,
    hasMore,
  };
};
