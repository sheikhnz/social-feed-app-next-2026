import { LikeTargetType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AUTHOR_SELECT, type AuthorPayload } from "./_shared";

/**
 * Idempotent like — creates the record if it doesn't exist.
 * The @@unique([userId, targetType, targetId]) constraint in the schema
 * guarantees exactly one like per user per target.
 */
export async function likeTarget(
  userId: string,
  targetType: LikeTargetType,
  targetId: string,
): Promise<void> {
  await prisma.like.upsert({
    where: { userId_targetType_targetId: { userId, targetType, targetId } },
    create: { userId, targetType, targetId },
    update: {},
  });
}

/**
 * Idempotent unlike — silently no-ops if the like does not exist.
 */
export async function unlikeTarget(
  userId: string,
  targetType: LikeTargetType,
  targetId: string,
): Promise<void> {
  await prisma.like
    .delete({
      where: { userId_targetType_targetId: { userId, targetType, targetId } },
    })
    .catch(() => {
      // Record not found — already unliked; treat as success.
    });
}

/**
 * Returns the total like count for a target.
 */
export async function getLikeCount(
  targetType: LikeTargetType,
  targetId: string,
): Promise<number> {
  return prisma.like.count({ where: { targetType, targetId } });
}

/**
 * Batch-fetches like counts for multiple targets of the same type.
 * Returns a Map<targetId, count>.
 */
export async function batchGetLikeCounts(
  targetType: LikeTargetType,
  targetIds: string[],
): Promise<Map<string, number>> {
  if (targetIds.length === 0) return new Map();
  const rows = await prisma.like.groupBy({
    by: ["targetId"],
    where: { targetType, targetId: { in: targetIds } },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.targetId, r._count._all]));
}

/**
 * Returns the set of targetIds that the given user has liked.
 */
export async function batchGetUserLiked(
  userId: string,
  targetType: LikeTargetType,
  targetIds: string[],
): Promise<Set<string>> {
  if (targetIds.length === 0) return new Set();
  const rows = await prisma.like.findMany({
    where: { userId, targetType, targetId: { in: targetIds } },
    select: { targetId: true },
  });
  return new Set(rows.map((r) => r.targetId));
}

/**
 * Batch-fetches recent likers for multiple targets.
 * We use Promise.all to fetch them concurrently for the limited set of targets.
 */
export async function batchGetRecentLikers(
  targetType: LikeTargetType,
  targetIds: string[],
  limit = 3,
): Promise<Map<string, AuthorPayload[]>> {
  const resultMap = new Map<string, AuthorPayload[]>();
  if (targetIds.length === 0) return resultMap;

  await Promise.all(
    targetIds.map(async (targetId) => {
      const rows = await prisma.like.findMany({
        where: { targetType, targetId },
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          user: { select: AUTHOR_SELECT },
        },
      });
      resultMap.set(
        targetId,
        rows.map((r) => r.user),
      );
    }),
  );

  return resultMap;
}

