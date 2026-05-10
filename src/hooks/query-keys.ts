/**
 * Centralized TanStack Query keys for use with `useQuery` / prefetch helpers.
 */

export const queryKeys = {
  root: ["app"] as const,
  health: () => [...queryKeys.root, "health"] as const,
  currentUser: () => [...queryKeys.root, "current-user"] as const,

  // Feed
  feed: ["feed"] as const,
  feedPosts: () => [...queryKeys.feed, "posts"] as const,
  feedComments: (postId: string) =>
    [...queryKeys.feed, "comments", postId] as const,
  feedReplies: (commentId: string) =>
    [...queryKeys.feed, "replies", commentId] as const,
} as const;
