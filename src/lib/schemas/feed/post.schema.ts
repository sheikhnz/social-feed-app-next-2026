import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(5000, "Content must be under 5000 characters"),
  imageUrl: z.string().url("Must be a valid URL").optional().nullable(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
});

export const feedQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type FeedQueryInput = z.infer<typeof feedQuerySchema>;
