import { LikeTargetType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildPaginatedResult, decodeCursor } from "@/lib/api/pagination";
import type { PaginatedResult } from "@/lib/api/pagination";
import { AUTHOR_SELECT, type AuthorPayload } from "./_shared";
import {
  batchGetLikeCounts,
  batchGetUserLiked,
  batchGetRecentLikers,
} from "./like.repository";
import type { CreateCommentInput } from "@/lib/schemas/feed/comment.schema";

export interface CommentWithMeta {
  id: string;
  postId: string;
  parentCommentId: string | null;
  content: string;
  createdAt: Date;
  author: AuthorPayload;
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  recentLikers: AuthorPayload[];
}

/**
 * Create a top-level comment or a reply.
 * `parentCommentId` being non-null makes it a reply.
 *
 * N+1 prevention: single query — likesCount is 0 on creation.
 */
export async function createComment(
  authorId: string,
  input: CreateCommentInput,
): Promise<CommentWithMeta> {
  const comment = await prisma.comment.create({
    data: {
      postId: input.postId,
      authorId,
      content: input.content,
      parentCommentId: input.parentCommentId ?? null,
    },
    include: {
      author: { select: AUTHOR_SELECT },
      _count: { select: { replies: true } },
    },
  });

  return {
    id: comment.id,
    postId: comment.postId,
    parentCommentId: comment.parentCommentId,
    content: comment.content,
    createdAt: comment.createdAt,
    author: comment.author,
    likesCount: 0,
    repliesCount: 0,
    isLiked: false,
    recentLikers: [],
  };
}

/**
 * Paginated top-level comments for a post (parentCommentId IS NULL).
 *
 * N+1 prevention: 3 queries total (comments, like counts, user likes) —
 * last 2 run in parallel via Promise.all.
 */
export async function getComments(
  userId: string,
  postId: string,
  cursor?: string,
  limit = 20,
): Promise<PaginatedResult<CommentWithMeta>> {
  return _getCommentPage(
    userId,
    { postId, parentCommentId: null },
    cursor,
    limit,
  );
}

/**
 * Paginated replies for a parent comment.
 */
export async function getReplies(
  userId: string,
  parentCommentId: string,
  cursor?: string,
  limit = 20,
): Promise<PaginatedResult<CommentWithMeta>> {
  return _getCommentPage(userId, { parentCommentId }, cursor, limit);
}

/**
 * Whether the comment exists and belongs to a post the user is allowed to read.
 * Prevents IDOR via comment/reply/like endpoints on private posts.
 */
export async function isCommentOnReadablePost(
  userId: string,
  commentId: string,
): Promise<boolean> {
  const count = await prisma.comment.count({
    where: {
      id: commentId,
      post: {
        OR: [
          { visibility: "PUBLIC" },
          { authorId: userId, visibility: "PRIVATE" },
        ],
      },
    },
  });
  return count > 0;
}

/**
 * Whether `parentCommentId` is a comment on `postId` (for reply creation).
 */
export async function isParentCommentOnPost(
  postId: string,
  parentCommentId: string,
): Promise<boolean> {
  const row = await prisma.comment.findFirst({
    where: { id: parentCommentId, postId },
    select: { id: true },
  });
  return row !== null;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function _getCommentPage(
  userId: string,
  where: { postId?: string; parentCommentId: string | null },
  cursor?: string,
  limit = 20,
): Promise<PaginatedResult<CommentWithMeta>> {
  const cursorId = cursor ? decodeCursor(cursor) : undefined;

  const rawComments = await prisma.comment.findMany({
    where,
    include: {
      author: { select: AUTHOR_SELECT },
      _count: { select: { replies: true } },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
  });

  const commentIds = rawComments.map((c) => c.id);

  const [likeCountMap, userLikedSet, recentLikersMap] = await Promise.all([
    batchGetLikeCounts(LikeTargetType.COMMENT, commentIds),
    batchGetUserLiked(userId, LikeTargetType.COMMENT, commentIds),
    batchGetRecentLikers(LikeTargetType.COMMENT, commentIds, 3),
  ]);

  const comments: CommentWithMeta[] = rawComments.map((c) => ({
    id: c.id,
    postId: c.postId,
    parentCommentId: c.parentCommentId,
    content: c.content,
    createdAt: c.createdAt,
    author: c.author,
    likesCount: likeCountMap.get(c.id) ?? 0,
    repliesCount: c._count.replies,
    isLiked: userLikedSet.has(c.id),
    recentLikers: recentLikersMap.get(c.id) ?? [],
  }));

  return buildPaginatedResult(comments, limit);
}
