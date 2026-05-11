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
