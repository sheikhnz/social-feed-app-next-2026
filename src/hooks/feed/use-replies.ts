"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchReplies } from "@/lib/api/feed-api";
import { queryKeys } from "@/hooks/query-keys";

/**
 * Lazy-loaded, paginated replies for a parent comment.
 * Pass `enabled: false` (default) until the replies section is toggled open.
 */
export function useReplies(parentCommentId: string, enabled = true) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.feedReplies(parentCommentId),
    queryFn: ({ pageParam }) =>
      fetchReplies(parentCommentId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled,
    staleTime: 30 * 1000,
  });

  const replies = query.data?.pages.flatMap((p) => p.items) ?? [];

  return {
    replies,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  };
}
