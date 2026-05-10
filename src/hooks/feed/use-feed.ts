"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchFeed } from "@/lib/api/feed-api";
import { queryKeys } from "@/hooks/query-keys";

/**
 * Infinite-scroll hook for the main post feed.
 * Attach `sentinelRef` to an empty div at the bottom of the list —
 * entering the viewport automatically fetches the next page.
 */
export function useFeed() {
  const query = useInfiniteQuery({
    queryKey: queryKeys.feedPosts(),
    queryFn: ({ pageParam }) => fetchFeed(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30 * 1000,
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          void query.fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [query]);

  // Flatten pages into a single post array
  const posts = query.data?.pages.flatMap((p) => p.items) ?? [];

  return {
    posts,
    sentinelRef,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    error: query.error,
    refetch: query.refetch,
  };
}
