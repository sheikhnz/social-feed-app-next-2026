import { LikeTargetType, Visibility } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildPaginatedResult, decodeCursor } from "@/lib/api/pagination";
import type { PaginatedResult } from "@/lib/api/pagination";
import { AUTHOR_SELECT, type AuthorPayload } from "./_shared";
import {
  batchGetLikeCounts,
  batchGetUserLiked,
  batchGetRecentLikers,
} from "./like.repository";
import type { CreatePostInput } from "@/lib/schemas/feed/post.schema";

export interface PostWithMeta {
  id: string;
  content: string;
  imageUrl: string | null;
  visibility: Visibility;
  createdAt: Date;
  author: AuthorPayload;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  recentLikers: AuthorPayload[];
}

/** Create a new post and return it with author info. */
export async function createPost(
  authorId: string,
  input: CreatePostInput,
): Promise<PostWithMeta> {
  const post = await prisma.post.create({
    data: {
      authorId,
      content: input.content,
      imageUrl: input.imageUrl ?? null,
      visibility: input.visibility,
    },
    include: {
      author: { select: AUTHOR_SELECT },
      _count: { select: { comments: true } },
    },
  });

  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    visibility: post.visibility,
    createdAt: post.createdAt,
    author: post.author,
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
    recentLikers: [],
  };
}

/**
 * Fetch the paginated feed for a user.
 *
 * Visibility rules:
 *   - All PUBLIC posts are included.
 *   - PRIVATE posts are included only if authored by the requesting user.
 *
 * N+1 prevention: 3 total queries per page —
 *   1. Posts + author + commentsCount (Prisma include)
 *   2. Batch like counts for all post IDs  (groupBy)
 *   3. Batch user-liked check for all post IDs (findMany)
 *   Queries 2 and 3 run in parallel via Promise.all.
 */
export async function getFeedPosts(
  userId: string,
  cursor?: string,
  limit = 20,
): Promise<PaginatedResult<PostWithMeta>> {
  const cursorId = cursor ? decodeCursor(cursor) : undefined;

  const feedWhere = {
    OR: [
      { visibility: "PUBLIC" as const },
      { authorId: userId, visibility: "PRIVATE" as const },
    ],
  };

  const rawPosts = await prisma.post.findMany({
    where: feedWhere,
    include: {
      author: { select: AUTHOR_SELECT },
      _count: { select: { comments: true } },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
  });

  const postIds = rawPosts.map((p) => p.id);

  const [likeCountMap, userLikedSet, recentLikersMap] = await Promise.all([
    batchGetLikeCounts(LikeTargetType.POST, postIds),
    batchGetUserLiked(userId, LikeTargetType.POST, postIds),
    batchGetRecentLikers(LikeTargetType.POST, postIds, 3),
  ]);

  const posts: PostWithMeta[] = rawPosts.map((p) => ({
    id: p.id,
    content: p.content,
    imageUrl: p.imageUrl,
    visibility: p.visibility,
    createdAt: p.createdAt,
    author: p.author,
    likesCount: likeCountMap.get(p.id) ?? 0,
    commentsCount: p._count.comments,
    isLiked: userLikedSet.has(p.id),
    recentLikers: recentLikersMap.get(p.id) ?? [],
  }));

  return buildPaginatedResult(posts, limit);
}

export type PostReadAccess = "ok" | "not_found" | "forbidden";

/**
 * Resolve whether `userId` may read `postId`.
 * - `not_found` — no post with this id
 * - `forbidden` — post exists but is private to another user (403)
 * - `ok` — readable (public or own private)
 */
export async function resolvePostReadAccess(
  userId: string,
  postId: string,
): Promise<PostReadAccess> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { visibility: true, authorId: true },
  });
  if (!post) return "not_found";
  if (post.visibility === "PRIVATE" && post.authorId !== userId) {
    return "forbidden";
  }
  return "ok";
}

/**
 * Whether the requesting user may read this post (PUBLIC, or PRIVATE authored by them).
 * Used to prevent IDOR on private posts for likes, comments, and related APIs.
 */
export async function isPostReadableByUser(
  userId: string,
  postId: string,
): Promise<boolean> {
  const access = await resolvePostReadAccess(userId, postId);
  return access === "ok";
}
