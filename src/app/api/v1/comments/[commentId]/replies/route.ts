import { type NextRequest } from "next/server";
import { withAuth } from "@/lib/api/auth-guard";
import { badRequest, notFound, ok } from "@/lib/api/response";
import { commentLikeParamsSchema } from "@/lib/schemas/feed/like.schema";
import {
  getReplies,
  isCommentOnReadablePost,
} from "@/lib/repositories/comment.repository";
import { z } from "zod";

const repliesQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

/**
 * GET /api/v1/comments/:commentId/replies
 * Fetch paginated replies for a parent comment.
 */
export const GET = withAuth<{ commentId: string }>(
  async (req: NextRequest, { userId, params }) => {
    const parsed = commentLikeParamsSchema.safeParse(params);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid commentId");
    }

    const { commentId } = parsed.data;
    if (!(await isCommentOnReadablePost(userId, commentId)))
      return notFound("Comment");

    const { searchParams } = new URL(req.url);
    const queryParsed = repliesQuerySchema.safeParse({
      cursor: searchParams.get("cursor") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });
    if (!queryParsed.success) {
      return badRequest(
        queryParsed.error.issues[0]?.message ?? "Invalid query",
      );
    }

    const { cursor, limit } = queryParsed.data;
    const result = await getReplies(userId, commentId, cursor, limit);
    return ok(result);
  },
);
