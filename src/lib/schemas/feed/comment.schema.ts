import { z } from "zod";

export const createCommentSchema = z.object({
  postId: z.string().uuid("postId must be a valid UUID"),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(2000, "Content must be under 2000 characters"),
  parentCommentId: z
    .string()
    .uuid("parentCommentId must be a valid UUID")
    .optional()
    .nullable(),
});

export const commentQuerySchema = z.object({
  postId: z.string().uuid("postId must be a valid UUID"),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CommentQueryInput = z.infer<typeof commentQuerySchema>;
