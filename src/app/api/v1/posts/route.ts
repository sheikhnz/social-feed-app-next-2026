import { type NextRequest } from "next/server";
import { withAuth } from "@/lib/api/auth-guard";
import { badRequest, created, ok } from "@/lib/api/response";
import { readValidatedJson } from "@/lib/api/validate-json";
import {
  createPostSchema,
  feedQuerySchema,
} from "@/lib/schemas/feed/post.schema";
import { createPost, getFeedPosts } from "@/lib/repositories/post.repository";
import { getCloudinaryEnv } from "@/lib/env";
import { isTrustedCloudinaryImageUrl } from "@/lib/uploads/cloudinary-url";

/**
 * POST /api/v1/posts
 * Create a new post for the authenticated user.
 *
 * Body: { content, imageUrl?, visibility? }
 * Returns 201 with PostWithMeta.
 */
export const POST = withAuth(async (req: NextRequest, { userId }) => {
  const bodyResult = await readValidatedJson(req, createPostSchema);
  if (!bodyResult.ok) return bodyResult.response;

  const { imageUrl } = bodyResult.data;
  if (imageUrl) {
    const cloudinaryEnv = getCloudinaryEnv();
    if (!cloudinaryEnv) {
      return badRequest("Image attachments are not enabled.");
    }
    if (
      !isTrustedCloudinaryImageUrl({
        urlString: imageUrl,
        trustedCloudName: cloudinaryEnv.cloudName,
      })
    ) {
      return badRequest("Invalid image URL.");
    }
  }

  const post = await createPost(userId, bodyResult.data);
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
    return badRequest(
      parsed.error.issues[0]?.message ?? "Invalid query params",
    );
  }

  const { cursor, limit } = parsed.data;
  const result = await getFeedPosts(userId, cursor, limit);
  return ok(result);
});
