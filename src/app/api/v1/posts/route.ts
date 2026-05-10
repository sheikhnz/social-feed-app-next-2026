import { type NextRequest } from "next/server";
import { withAuth } from "@/lib/api/auth-guard";
import { badRequest, created, ok } from "@/lib/api/response";
import { createPostSchema, feedQuerySchema } from "@/lib/schemas/feed/post.schema";
import { createPost, getFeedPosts } from "@/lib/repositories/post.repository";

/**
 * POST /api/v1/posts
 * Create a new post for the authenticated user.
 *
 * Body: { content, imageUrl?, visibility? }
 * Returns 201 with PostWithMeta.
 */
export const POST = withAuth(async (req: NextRequest, { userId }) => {
  const body = await req.json().catch(() => null);
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message ?? "Invalid request body");
  }

  const post = await createPost(userId, parsed.data);
  return created(post);
});

/**
 * GET /api/v1/posts
 * Fetch the paginated social feed for the authenticated user.
 *
 * Query: ?cursor=<base64>&limit=<1-50>
 * Returns 200 with PaginatedResult<PostWithMeta>.
 *
 * Feed rules:
 *   - All PUBLIC posts (from anyone)
 *   - Current user's own PRIVATE posts
 *   - Newest first
 */
export const GET = withAuth(async (req: NextRequest, { userId }) => {
  const { searchParams } = new URL(req.url);
  const parsed = feedQuerySchema.safeParse({
    cursor: searchParams.get("cursor") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message ?? "Invalid query params");
  }

  const { cursor, limit } = parsed.data;
  const result = await getFeedPosts(userId, cursor, limit);
  return ok(result);
});
