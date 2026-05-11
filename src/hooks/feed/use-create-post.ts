"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { createPost } from "@/lib/api/feed-api";
import { queryKeys } from "@/hooks/query-keys";
import type { PostWithMeta } from "@/lib/repositories/post.repository";
import type { PaginatedResult } from "@/lib/api/pagination";
import type { CreatePostInput } from "@/lib/schemas/feed/post.schema";

type FeedPages = InfiniteData<PaginatedResult<PostWithMeta>>;

/**
 * Mutation for creating a new post with optimistic prepend at the top of the feed.
 */
export function useCreatePost(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePostInput) => createPost(input),

    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: queryKeys.feedPosts() });
      const previous = qc.getQueryData<FeedPages>(queryKeys.feedPosts());

      // Optimistic post — real server data overwrites on settle
      const optimistic: PostWithMeta = {
        id: `temp-${Date.now()}`,
        content: input.content,
        imageUrl: input.imageUrl ?? null,
        visibility: input.visibility,
        createdAt: new Date(),
        author: {
          id: "",
          firstName: null,
          lastName: null,
          name: "You",
          image: null,
        },
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        recentLikers: [],
      };

      qc.setQueryData<FeedPages>(queryKeys.feedPosts(), (old) => {
        if (!old) return old;
        const [firstPage, ...rest] = old.pages;
        return {
          ...old,
          pages: [
            { ...firstPage!, items: [optimistic, ...(firstPage?.items ?? [])] },
            ...rest,
          ],
        };
      });

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(queryKeys.feedPosts(), ctx.previous);
      }
    },

    onSuccess: (newPost) => {
      // Replace optimistic entry with real server data
      qc.setQueryData<FeedPages>(queryKeys.feedPosts(), (old) => {
        if (!old) return old;
        const [firstPage, ...rest] = old.pages;
        return {
          ...old,
          pages: [
            {
              ...firstPage!,
              items: firstPage!.items.map((p) =>
                p.id.startsWith("temp-") ? newPost : p,
              ),
            },
            ...rest,
          ],
        };
      });
      options?.onSuccess?.();
    },
  });
}
