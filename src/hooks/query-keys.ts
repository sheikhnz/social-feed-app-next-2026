/**
 * Centralized TanStack Query keys for use with `useQuery` / prefetch helpers.
 */

export const queryKeys = {
  root: ["app"] as const,
  health: () => [...queryKeys.root, "health"] as const,
  currentUser: () => [...queryKeys.root, "current-user"] as const,
} as const;
