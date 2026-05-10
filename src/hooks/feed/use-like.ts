"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { likePost, unlikePost, likeComment, unlikeComment } from "@/lib/api/feed-api";
import { queryKeys } from "@/hooks/query-keys";
import type { PostWithMeta } from "@/lib/repositories/post.repository";
import type { CommentWithMeta } from "@/lib/repositories/comment.repository";
import type { PaginatedResult } from "@/lib/api/pagination";

type FeedPages = InfiniteData<PaginatedResult<PostWithMeta>>;
type CommentPages = InfiniteData<PaginatedResult<CommentWithMeta>>;

// ---------------------------------------------------------------------------
// Like a Post
// ---------------------------------------------------------------------------

export function useLikePost(postId: string) {
  const qc = useQueryClient();

  const mutate = async (liked: boolean) => {
    const key = queryKeys.feedPosts();
    await qc.cancelQueries({ queryKey: key });
    const previous = qc.getQueryData<FeedPages>(key);

    // Optimistic toggle
    qc.setQueryData<FeedPages>(key, (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  isLiked: liked,
                  likesCount: p.likesCount + (liked ? 1 : -1),
                }
              : p,
          ),
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

export function useLikeComment(commentId: string, postId: string) {
  const qc = useQueryClient();

  const mutate = async (liked: boolean) => {
    const key = queryKeys.feedComments(postId);
    await qc.cancelQueries({ queryKey: key });
    const previous = qc.getQueryData<CommentPages>(key);

    qc.setQueryData<CommentPages>(key, (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  isLiked: liked,
                  likesCount: c.likesCount + (liked ? 1 : -1),
                }
              : c,
          ),
        })),
      };
    });

    return previous;
  };

  const like = useMutation({
    mutationFn: () => likeComment(commentId),
    onMutate: () => mutate(true),
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData(queryKeys.feedComments(postId), ctx);
    },
  });

  const unlike = useMutation({
    mutationFn: () => unlikeComment(commentId),
    onMutate: () => mutate(false),
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData(queryKeys.feedComments(postId), ctx);
    },
  });

  return { like, unlike, isPending: like.isPending || unlike.isPending };
}
