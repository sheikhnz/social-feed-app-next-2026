import type { ApiSuccess, ApiError } from "@/lib/api/response";
import type { PostWithMeta } from "@/lib/repositories/post.repository";
import type { CommentWithMeta } from "@/lib/repositories/comment.repository";
import type { PaginatedResult } from "@/lib/api/pagination";
import type { CreatePostInput } from "@/lib/schemas/feed/post.schema";
import type { CloudinarySignedUploadParams } from "@/lib/uploads/cloudinary-upload-types";
import type { CreateCommentInput } from "@/lib/schemas/feed/comment.schema";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<ApiSuccess<T>> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const json = (await res.json()) as ApiSuccess<T> | ApiError;

  if (!json.success) {
    throw new Error((json as ApiError).error ?? "Request failed");
  }
  return json;
}

// ---------------------------------------------------------------------------
// Feed / Posts
// ---------------------------------------------------------------------------

export async function fetchFeed(
  cursor?: string,
  limit = 20,
): Promise<PaginatedResult<PostWithMeta>> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  const { data } = await apiFetch<PaginatedResult<PostWithMeta>>(
    `/api/v1/posts?${params}`,
  );
  return data;
}

export async function createPost(
  input: CreatePostInput,
): Promise<PostWithMeta> {
  const { data } = await apiFetch<PostWithMeta>("/api/v1/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data;
}

/**
 * Requests signed Cloudinary upload parameters for the current session (requires auth cookie).
 */
export async function fetchCloudinarySignedUploadParams(): Promise<CloudinarySignedUploadParams> {
  const { data } = await apiFetch<CloudinarySignedUploadParams>(
    "/api/v1/uploads/cloudinary",
    { method: "POST", body: JSON.stringify({}) },
  );
  return data;
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

export async function fetchComments(
  postId: string,
  cursor?: string,
  limit = 10,
): Promise<PaginatedResult<CommentWithMeta>> {
  const params = new URLSearchParams({ postId, limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  const { data } = await apiFetch<PaginatedResult<CommentWithMeta>>(
    `/api/v1/comments?${params}`,
  );
  return data;
}

export async function fetchReplies(
  parentCommentId: string,
  cursor?: string,
  limit = 10,
): Promise<PaginatedResult<CommentWithMeta>> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  const { data } = await apiFetch<PaginatedResult<CommentWithMeta>>(
    `/api/v1/comments/${parentCommentId}/replies?${params}`,
  );
  return data;
}

export async function createComment(
  input: CreateCommentInput,
): Promise<CommentWithMeta> {
  const { data } = await apiFetch<CommentWithMeta>("/api/v1/comments", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data;
}

// ---------------------------------------------------------------------------
// Post Likes
// ---------------------------------------------------------------------------

export interface LikePostResult {
  postId: string;
  liked: boolean;
  likesCount: number;
}

export async function likePost(postId: string): Promise<LikePostResult> {
  const { data } = await apiFetch<LikePostResult>(
    `/api/v1/posts/${postId}/likes`,
    { method: "POST" },
  );
  return data;
}

export async function unlikePost(postId: string): Promise<LikePostResult> {
  const { data } = await apiFetch<LikePostResult>(
    `/api/v1/posts/${postId}/likes`,
    { method: "DELETE" },
  );
  return data;
}

// ---------------------------------------------------------------------------
// Comment Likes
// ---------------------------------------------------------------------------

export interface LikeCommentResult {
  commentId: string;
  liked: boolean;
  likesCount: number;
}

export async function likeComment(
  commentId: string,
): Promise<LikeCommentResult> {
  const { data } = await apiFetch<LikeCommentResult>(
    `/api/v1/comments/${commentId}/likes`,
    { method: "POST" },
  );
  return data;
}

export async function unlikeComment(
  commentId: string,
): Promise<LikeCommentResult> {
  const { data } = await apiFetch<LikeCommentResult>(
    `/api/v1/comments/${commentId}/likes`,
    { method: "DELETE" },
  );
  return data;
}
