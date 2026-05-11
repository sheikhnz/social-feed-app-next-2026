"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { createComment } from "@/lib/api/feed-api";
import { queryKeys } from "@/hooks/query-keys";
import type { CommentWithMeta } from "@/lib/repositories/comment.repository";
import type { PaginatedResult } from "@/lib/api/pagination";
import type { CreateCommentInput } from "@/lib/schemas/feed/comment.schema";

type CommentPages = InfiniteData<PaginatedResult<CommentWithMeta>>;

/**
 * Mutation for creating a top-level comment OR a reply.
 *
 * - If `input.parentCommentId` is set → optimistically prepends to the
 *   feedReplies cache for that parent (same newest-first order as the API).
 * - Otherwise → optimistically prepends to the feedComments cache for the post.
 */
export function useCreateComment(
  postId: string,
  options?: { onSuccess?: () => void },
) {
  const qc = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (input: CreateCommentInput) => createComment(input),

    onMutate: async (input) => {
      const isReply = !!input.parentCommentId;
      const key = isReply
        ? queryKeys.feedReplies(input.parentCommentId!)
        : queryKeys.feedComments(postId);

      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<CommentPages>(key);

      const u = session?.user;
      const optimistic: CommentWithMeta = {
        id: `temp-${Date.now()}`,
        postId,
        parentCommentId: input.parentCommentId ?? null,
        content: input.content,
        createdAt: new Date(),
        author: {
          id: u?.id ?? "",
          firstName: u?.firstName ?? null,
          lastName: u?.lastName ?? null,
          name: u?.name ?? "You",
          image: u?.image ?? null,
        },
        likesCount: 0,
        repliesCount: 0,
        isLiked: false,
        recentLikers: [],
      };

      qc.setQueryData<CommentPages>(key, (old) => {
        // Seed the cache from scratch if replies were never loaded yet
        if (!old) {
          return {
            pages: [{ items: [optimistic], nextCursor: null, hasMore: false }],
            pageParams: [undefined],
          };
        }
        const [firstPage, ...rest] = old.pages;
        return {
          ...old,
          pages: [
            {
              ...firstPage!,
              /** Newest-first matches `getComments` / `getReplies` (createdAt desc). */
              items: [optimistic, ...(firstPage?.items ?? [])],
            },
            ...rest,
          ],
        };
      });

      return { previous, key };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous && ctx?.key) {
        qc.setQueryData(ctx.key, ctx.previous);
      }
    },

    onSuccess: (newComment, input) => {
      const isReply = !!input.parentCommentId;
      const key = isReply
        ? queryKeys.feedReplies(input.parentCommentId!)
        : queryKeys.feedComments(postId);

      // Replace temp entry with real server data (or seed if cache still missing)
      qc.setQueryData<CommentPages>(key, (old) => {
        if (!old) {
          return {
            pages: [{ items: [newComment], nextCursor: null, hasMore: false }],
            pageParams: [undefined],
          };
        }
        const [firstPage, ...rest] = old.pages;
        return {
          ...old,
          pages: [
            {
              ...firstPage!,
              items: firstPage!.items.map((c) =>
                c.id.startsWith("temp-") ? newComment : c,
              ),
            },
            ...rest,
          ],
        };
      });

      // After a reply, also bump the repliesCount on the parent comment
      if (isReply) {
        const commentsKey = queryKeys.feedComments(postId);
        qc.setQueryData<CommentPages>(commentsKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((c) =>
                c.id === input.parentCommentId
                  ? { ...c, repliesCount: c.repliesCount + 1 }
                  : c,
              ),
            })),
          };
        });
      }

      options?.onSuccess?.();
    },

    onSettled: (_data, _err, input) => {
      // Refresh feed posts so commentsCount stays accurate
      void qc.invalidateQueries({ queryKey: queryKeys.feedPosts() });
      // Refresh replies list so newly added reply is synced from server
      if (input.parentCommentId) {
        void qc.invalidateQueries({
          queryKey: queryKeys.feedReplies(input.parentCommentId),
        });
      }
    },
  });
}
