import { LikeTargetType } from "@prisma/client";
import { withAuth } from "@/lib/api/auth-guard";
import { badRequest, ok } from "@/lib/api/response";
import { resourceAccessToResponse } from "@/lib/api/resource-access-response";
import { commentLikeParamsSchema } from "@/lib/schemas/feed/like.schema";
import {
  likeTarget,
  unlikeTarget,
  getLikeCount,
} from "@/lib/repositories/like.repository";
import { resolveCommentReadAccess } from "@/lib/repositories/comment.repository";

/**
 * POST /api/v1/comments/:commentId/likes
 * Like a comment (idempotent).
 */
export const POST = withAuth<{ commentId: string }>(
  async (_req, { userId, params }) => {
    const parsed = commentLikeParamsSchema.safeParse(params);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid commentId");
    }

    const { commentId } = parsed.data;
    const denied = resourceAccessToResponse(
      await resolveCommentReadAccess(userId, commentId),
      "Comment",
    );
    if (denied) return denied;

    await likeTarget(userId, LikeTargetType.COMMENT, commentId);
    const likesCount = await getLikeCount(LikeTargetType.COMMENT, commentId);
    return ok({ commentId, liked: true, likesCount });
  },
);

/**
 * DELETE /api/v1/comments/:commentId/likes
 * Unlike a comment (idempotent).
 */
export const DELETE = withAuth<{ commentId: string }>(
  async (_req, { userId, params }) => {
    const parsed = commentLikeParamsSchema.safeParse(params);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid commentId");
    }

    const { commentId } = parsed.data;
    const denied = resourceAccessToResponse(
      await resolveCommentReadAccess(userId, commentId),
      "Comment",
    );
    if (denied) return denied;

    await unlikeTarget(userId, LikeTargetType.COMMENT, commentId);
    const likesCount = await getLikeCount(LikeTargetType.COMMENT, commentId);
    return ok({ commentId, liked: false, likesCount });
  },
);
