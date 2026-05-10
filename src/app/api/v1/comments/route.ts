import { type NextRequest } from "next/server";
import { withAuth } from "@/lib/api/auth-guard";
import { badRequest, created, ok } from "@/lib/api/response";
import {
  createCommentSchema,
  commentQuerySchema,
} from "@/lib/schemas/feed/comment.schema";
import {
  createComment,
  getComments,
} from "@/lib/repositories/comment.repository";

/**
 * POST /api/v1/comments
 * Create a top-level comment or a reply to another comment.
 *
 * Body: { postId, content, parentCommentId? }
 * Returns 201 with CommentWithMeta.
 */
export const POST = withAuth(async (req: NextRequest, { userId }) => {
  const body = await req.json().catch(() => null);
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  const comment = await createComment(userId, parsed.data);
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
    return badRequest(parsed.error.issues[0]?.message ?? "Invalid query params");
  }

  const { postId, cursor, limit } = parsed.data;
  const result = await getComments(userId, postId, cursor, limit);
  return ok(result);
});
