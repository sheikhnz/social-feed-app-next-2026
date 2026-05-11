export const AUTHOR_HEADER_FALLBACK_UNKNOWN = "Unknown";

export const USER_LABEL_FALLBACK_SOMEONE = "Someone";

/**
 * Composer / card header pattern: full "First Last" only when both names exist,
 * otherwise fall back to `name` or `fallback`.
 */
export const resolveAuthorHeaderName = (args: {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  fallback?: string;
}): string => {
  const { firstName, lastName, name, fallback = AUTHOR_HEADER_FALLBACK_UNKNOWN } =
    args;
  if (firstName && lastName) return `${firstName} ${lastName}`;
  return name ?? fallback;
};

/**
 * Liker/tooltip lists: prefers stored `display name`, then joined first/last parts.
 */
export const resolveUserLabelPreferName = (args: {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fallback?: string;
}): string => {
  const {
    name,
    firstName,
    lastName,
    fallback = USER_LABEL_FALLBACK_SOMEONE,
  } = args;
  const trimmed = name?.trim();
  if (trimmed) return trimmed;
  const fromParts = [firstName, lastName].filter(Boolean).join(" ");
  return fromParts || fallback;
};

export function getUserName(
  firstName?: string | null,
  lastName?: string | null,
  fallback = "User",
  name?: string | null,
): string {
  return [firstName, lastName].filter(Boolean).join(" ") || name || fallback;
}

export function getUserInitial(name: string): string {
  return name.charAt(0).toUpperCase() || "U";
}
