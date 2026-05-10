export function getUserName(firstName?: string | null, lastName?: string | null, fallback = "User"): string {
  return [firstName, lastName].filter(Boolean).join(" ") || fallback;
}

export function getUserInitial(name: string): string {
  return name.charAt(0).toUpperCase() || "U";
}
