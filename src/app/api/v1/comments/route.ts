import { type NextRequest } from "next/server";
import { withAuth } from "@/lib/api/auth-guard";
import { badRequest, created, notFound, ok } from "@/lib/api/response";
import { resourceAccessToResponse } from "@/lib/api/resource-access-response";
import { readValidatedJson } from "@/lib/api/validate-json";
import {
  createCommentSchema,
  commentQuerySchema,
} from "@/lib/schemas/feed/comment.schema";
import {
  createComment,
  getComments,
  isParentCommentOnPost,
} from "@/lib/repositories/comment.repository";
import { resolvePostReadAccess } from "@/lib/repositories/post.repository";

/**
 * POST /api/v1/comments
 * Create a top-level comment or a reply to another comment.
 *
 * Body: { postId, content, parentCommentId? }
 * Returns 201 with CommentWithMeta.
 */
export const POST = withAuth(async (req: NextRequest, { userId }) => {
  const bodyResult = await readValidatedJson(req, createCommentSchema);
  if (!bodyResult.ok) return bodyResult.response;

  const { postId, parentCommentId } = bodyResult.data;
  const denied = resourceAccessToResponse(
    await resolvePostReadAccess(userId, postId),
    "Post",
  );
  if (denied) return denied;
  if (
    parentCommentId &&
    !(await isParentCommentOnPost(postId, parentCommentId))
  ) {
    return notFound("Comment");
  }

  const comment = await createComment(userId, bodyResult.data);
  return created(comment);
});

/**
 * GET /api/v1/comments?postId=<uuid>&cursor=<base64>&limit=<1-50>
 * Fetch paginated top-level comments for a post.
 *
 * Returns 200 with PaginatedResult<CommentWithMeta>.
 */
export const GET = withAuth(async (req: NextRequest, { userId }) => {
  const { searchParams } = new URL(req.url);
  const parsed = commentQuerySchema.safeParse({
    postId: searchParams.get("postId") ?? undefined,
    cursor: searchParams.get("cursor") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success) {
    return badRequest(
      parsed.error.issues[0]?.message ?? "Invalid query params",
    );
  }

  const { postId, cursor, limit } = parsed.data;
  const denied = resourceAccessToResponse(
    await resolvePostReadAccess(userId, postId),
    "Post",
  );
  if (denied) return denied;
  const result = await getComments(userId, postId, cursor, limit);
  return ok(result);
});
