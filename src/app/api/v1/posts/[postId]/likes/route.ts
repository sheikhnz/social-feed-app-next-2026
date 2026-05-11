import { LikeTargetType } from "@prisma/client";
import { withAuth } from "@/lib/api/auth-guard";
import { badRequest, notFound, ok } from "@/lib/api/response";
import { resourceAccessToResponse } from "@/lib/api/resource-access-response";
import { postLikeParamsSchema } from "@/lib/schemas/feed/like.schema";
import {
  likeTarget,
  unlikeTarget,
  getLikeCount,
} from "@/lib/repositories/like.repository";
import { resolvePostReadAccess } from "@/lib/repositories/post.repository";

/**
 * POST /api/v1/posts/:postId/likes
 * Like a post (idempotent — safe to call multiple times).
 */
export const POST = withAuth<{ postId: string }>(
  async (_req, { userId, params }) => {
    const parsed = postLikeParamsSchema.safeParse(params);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid postId");
    }

    const { postId } = parsed.data;
    const denied = resourceAccessToResponse(
      await resolvePostReadAccess(userId, postId),
      "Post",
    );
    if (denied) return denied;

    await likeTarget(userId, LikeTargetType.POST, postId);
    const likesCount = await getLikeCount(LikeTargetType.POST, postId);
    return ok({ postId, liked: true, likesCount });
  },
);

/**
 * DELETE /api/v1/posts/:postId/likes
 * Unlike a post (idempotent — safe to call multiple times).
 */
export const DELETE = withAuth<{ postId: string }>(
  async (_req, { userId, params }) => {
    const parsed = postLikeParamsSchema.safeParse(params);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid postId");
    }

    const { postId } = parsed.data;
    const denied = resourceAccessToResponse(
      await resolvePostReadAccess(userId, postId),
      "Post",
    );
    if (denied) return denied;

    await unlikeTarget(userId, LikeTargetType.POST, postId);
    const likesCount = await getLikeCount(LikeTargetType.POST, postId);
    return ok({ postId, liked: false, likesCount });
  },
);
