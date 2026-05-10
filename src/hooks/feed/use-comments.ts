"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchComments } from "@/lib/api/feed-api";
import { queryKeys } from "@/hooks/query-keys";

/**
 * Lazy-loaded, infinite paginated comments for a post.
 * Pass `enabled: false` until the comment section is opened.
 */
export function useComments(postId: string, enabled = true) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.feedComments(postId),
    queryFn: ({ pageParam }) =>
      fetchComments(postId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled,
    staleTime: 30 * 1000,
  });

  const loadMoreRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first?.isIntersecting &&
          query.hasNextPage &&
          !query.isFetchingNextPage
        ) {
          void query.fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [query]);

  const comments = query.data?.pages.flatMap((p) => p.items) ?? [];

  return {
    comments,
    loadMoreRef,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    error: query.error,
  };
}
