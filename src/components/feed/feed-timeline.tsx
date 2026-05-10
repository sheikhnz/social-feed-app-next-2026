"use client";

import { useFeed } from "@/hooks/feed/use-feed";
import { PostCard } from "@/components/feed/post-card";
import { PostCardSkeleton } from "@/components/feed/post-card-skeleton";

const SKELETON_COUNT = 3;

/**
 * FeedList — infinite-scroll list of PostCards.
 * - Shows shimmer skeletons on initial load.
 * - Automatically loads the next page as the user scrolls to the sentinel.
 * - Shows a subtle spinner when fetching subsequent pages.
 */
export const FeedList = () => {
  const { posts, sentinelRef, isLoading, isFetchingNextPage, hasNextPage, error } =
    useFeed();

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="_feed_error_state" role="alert">
        <p>Couldn&apos;t load posts. Please try again.</p>
        <button
          type="button"
          className="_feed_inner_text_area_btn_link"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Initial skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div aria-label="Loading feed" aria-busy="true">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (posts.length === 0) {
    return (
      <div className="_feed_empty_state">
        <p>No posts yet — be the first to share something!</p>
      </div>
    );
  }

  return (
    <div role="feed" aria-label="Social feed">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Infinite-scroll sentinel */}
      {hasNextPage ? (
        <div
          ref={sentinelRef}
          className="_feed_sentinel"
          aria-hidden="true"
        >
          {isFetchingNextPage && (
            <div className="_feed_loading_more" aria-label="Loading more posts">
              <span className="_feed_spinner" />
            </div>
          )}
        </div>
      ) : (
        posts.length > 0 && (
          <p className="_feed_end_message">
            {"You're all caught up! 🎉"}
          </p>
        )
      )}
    </div>
  );
};

// Legacy alias kept for any existing imports
export { FeedList as FeedTimeline };
