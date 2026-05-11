"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
} from "@/lib/api/feed-api";
import { queryKeys } from "@/hooks/query-keys";
import type { PostWithMeta } from "@/lib/repositories/post.repository";
import type { CommentWithMeta } from "@/lib/repositories/comment.repository";
import type { PaginatedResult } from "@/lib/api/pagination";
import type { AuthorPayload } from "@/lib/repositories/_shared";

type FeedPages = InfiniteData<PaginatedResult<PostWithMeta>>;
type CommentPages = InfiniteData<PaginatedResult<CommentWithMeta>>;

// ---------------------------------------------------------------------------
// Like a Post
// ---------------------------------------------------------------------------

export function useLikePost(postId: string) {
  const qc = useQueryClient();
  const { data: session } = useSession();

  const mutate = async (liked: boolean) => {
    const key = queryKeys.feedPosts();
    await qc.cancelQueries({ queryKey: key });
    const previous = qc.getQueryData<FeedPages>(key);

    const currentUserLiker: AuthorPayload | null = session?.user
      ? {
          id: session.user.id || "optimistic-id",
          firstName: session.user.firstName || null,
          lastName: session.user.lastName || null,
          name: session.user.name || null,
          image: session.user.image || null,
        }
      : null;

    // Optimistic toggle
    qc.setQueryData<FeedPages>(key, (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map((p) => {
            if (p.id !== postId) return p;

            let newRecentLikers = p.recentLikers ? [...p.recentLikers] : [];
            if (liked && currentUserLiker) {
              if (!newRecentLikers.find((l) => l.id === currentUserLiker.id)) {
                newRecentLikers.unshift(currentUserLiker);
                // Keep only top 3
                if (newRecentLikers.length > 3) {
                  newRecentLikers.pop();
                }
              }
            } else if (!liked && currentUserLiker) {
              newRecentLikers = newRecentLikers.filter(
                (l) => l.id !== currentUserLiker.id,
              );
            }

            return {
              ...p,
              isLiked: liked,
              likesCount: p.likesCount + (liked ? 1 : -1),
              recentLikers: newRecentLikers,
            };
          }),
        })),
      };
    });

    return previous;
  };

  const like = useMutation({
    mutationFn: () => likePost(postId),
    onMutate: () => mutate(true),
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData(queryKeys.feedPosts(), ctx);
    },
  });

  const unlike = useMutation({
    mutationFn: () => unlikePost(postId),
    onMutate: () => mutate(false),
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData(queryKeys.feedPosts(), ctx);
    },
  });

  return { like, unlike, isPending: like.isPending || unlike.isPending };
}

// ---------------------------------------------------------------------------
// Like a Comment
// ---------------------------------------------------------------------------

export function useLikeComment(
  commentId: string,
  postId: string,
  /** Pass the parent comment's id when liking a reply so the correct cache is updated. */
  parentCommentId?: string,
) {
  const qc = useQueryClient();
  const { data: session } = useSession();

  const mutate = async (liked: boolean) => {
    const currentUserLiker: AuthorPayload | null = session?.user
      ? {
          id: session.user.id || "optimistic-id",
          firstName: session.user.firstName || null,
          lastName: session.user.lastName || null,
          name: session.user.name || null,
          image: session.user.image || null,
        }
      : null;

    if (parentCommentId) {
      // --- Reply: update the feedReplies cache keyed by parent comment id ---
      const key = queryKeys.feedReplies(parentCommentId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<CommentPages>(key);

      qc.setQueryData<CommentPages>(key, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((c) => {
              if (c.id !== commentId) return c;

              let newRecentLikers = c.recentLikers ? [...c.recentLikers] : [];
              if (liked && currentUserLiker) {
                if (
                  !newRecentLikers.find((l) => l.id === currentUserLiker.id)
                ) {
                  newRecentLikers.unshift(currentUserLiker);
                  if (newRecentLikers.length > 3) {
                    newRecentLikers.pop();
                  }
                }
              } else if (!liked && currentUserLiker) {
                newRecentLikers = newRecentLikers.filter(
                  (l) => l.id !== currentUserLiker.id,
                );
              }

              return {
                ...c,
                isLiked: liked,
                likesCount: c.likesCount + (liked ? 1 : -1),
                recentLikers: newRecentLikers,
              };
            }),
          })),
        };
      });

      return previous;
    }

    // --- Top-level comment: update the feedComments cache keyed by post id ---
    const key = queryKeys.feedComments(postId);
    await qc.cancelQueries({ queryKey: key });
    const previous = qc.getQueryData<CommentPages>(key);

    qc.setQueryData<CommentPages>(key, (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map((c) => {
            if (c.id !== commentId) return c;

            let newRecentLikers = c.recentLikers ? [...c.recentLikers] : [];
            if (liked && currentUserLiker) {
              if (!newRecentLikers.find((l) => l.id === currentUserLiker.id)) {
                newRecentLikers.unshift(currentUserLiker);
                if (newRecentLikers.length > 3) {
                  newRecentLikers.pop();
                }
              }
            } else if (!liked && currentUserLiker) {
              newRecentLikers = newRecentLikers.filter(
                (l) => l.id !== currentUserLiker.id,
              );
            }

            return {
              ...c,
              isLiked: liked,
              likesCount: c.likesCount + (liked ? 1 : -1),
              recentLikers: newRecentLikers,
            };
          }),
        })),
      };
    });

    return previous;
  };

  const errorKey = parentCommentId
    ? queryKeys.feedReplies(parentCommentId)
    : queryKeys.feedComments(postId);

  const like = useMutation({
    mutationFn: () => likeComment(commentId),
    onMutate: () => mutate(true),
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData(errorKey, ctx);
    },
  });

  const unlike = useMutation({
    mutationFn: () => unlikeComment(commentId),
    onMutate: () => mutate(false),
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData(errorKey, ctx);
    },
  });

  return { like, unlike, isPending: like.isPending || unlike.isPending };
}
