import { z } from "zod";

export const postLikeParamsSchema = z.object({
  postId: z.string().uuid("postId must be a valid UUID"),
});

export const commentLikeParamsSchema = z.object({
  commentId: z.string().uuid("commentId must be a valid UUID"),
});
