"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { createComment } from "@/lib/api/feed-api";
import { queryKeys } from "@/hooks/query-keys";
import type { CommentWithMeta } from "@/lib/repositories/comment.repository";
import type { PaginatedResult } from "@/lib/api/pagination";
import type { CreateCommentInput } from "@/lib/schemas/feed/comment.schema";

type CommentPages = InfiniteData<PaginatedResult<CommentWithMeta>>;

/**
 * Mutation for creating a comment (or reply).
 * Optimistically appends to the first page of the comment list.
 */
export function useCreateComment(
  postId: string,
  options?: { onSuccess?: () => void },
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCommentInput) => createComment(input),

    onMutate: async (input) => {
      const key = queryKeys.feedComments(postId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<CommentPages>(key);

      const optimistic: CommentWithMeta = {
        id: `temp-${Date.now()}`,
        postId,
        parentCommentId: input.parentCommentId ?? null,
        content: input.content,
        createdAt: new Date(),
        author: {
          id: "",
          firstName: null,
          lastName: null,
          name: "You",
          image: null,
        },
        likesCount: 0,
        repliesCount: 0,
        isLiked: false,
      };

      qc.setQueryData<CommentPages>(key, (old) => {
        if (!old) return old;
        const [firstPage, ...rest] = old.pages;
        return {
          ...old,
          pages: [
            {
              ...firstPage!,
              items: [...(firstPage?.items ?? []), optimistic],
            },
            ...rest,
          ],
        };
      });

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(queryKeys.feedComments(postId), ctx.previous);
      }
    },

    onSuccess: (newComment) => {
      const key = queryKeys.feedComments(postId);
      qc.setQueryData<CommentPages>(key, (old) => {
        if (!old) return old;
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
      options?.onSuccess?.();
    },

    onSettled: () => {
      // Refresh feed posts so commentsCount stays accurate
      void qc.invalidateQueries({ queryKey: queryKeys.feedPosts() });
    },
  });
}
