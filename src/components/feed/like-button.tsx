"use client";

import { useCallback } from "react";
import type { PostWithMeta } from "@/lib/repositories/post.repository";
import type { CommentWithMeta } from "@/lib/repositories/comment.repository";
import { useLikePost } from "@/hooks/feed/use-like";
import { useLikeComment } from "@/hooks/feed/use-like";

// ---------------------------------------------------------------------------
// Post like button
// ---------------------------------------------------------------------------

type PostLikeButtonProps = {
  post: Pick<PostWithMeta, "id" | "isLiked" | "likesCount">;
};

export const PostLikeButton = ({ post }: PostLikeButtonProps) => {
  const { like, unlike, isPending } = useLikePost(post.id);

  const handleClick = useCallback(() => {
    if (isPending) return;
    if (post.isLiked) {
      unlike.mutate();
    } else {
      like.mutate();
    }
  }, [post.isLiked, like, unlike, isPending]);

  return (
    <button
      type="button"
      className={`_feed_inner_timeline_reaction_emoji _feed_reaction${post.isLiked ? " _feed_reaction_active" : ""}`}
      onClick={handleClick}
      disabled={isPending}
      aria-label={post.isLiked ? "Unlike post" : "Like post"}
      aria-pressed={post.isLiked}
    >
      <span className="_feed_inner_timeline_reaction_link">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12.73 4A2 2 0 0 1 16.38 3H17a1 1 0 0 1 1 1v2" />
          </svg>
          {post.likesCount > 0 ? (
            <span className="_like_count">{post.likesCount}</span>
          ) : null}
          {" Like"}
        </span>
      </span>
    </button>
  );
};

// ---------------------------------------------------------------------------
// Comment like button
// ---------------------------------------------------------------------------

type CommentLikeButtonProps = {
  comment: Pick<CommentWithMeta, "id" | "postId" | "isLiked" | "likesCount">;
};

export const CommentLikeButton = ({ comment }: CommentLikeButtonProps) => {
  const { like, unlike, isPending } = useLikeComment(comment.id, comment.postId);

  const handleClick = useCallback(() => {
    if (isPending) return;
    if (comment.isLiked) {
      unlike.mutate();
    } else {
      like.mutate();
    }
  }, [comment.isLiked, like, unlike, isPending]);

  return (
    <button
      type="button"
      className={`_comment_like_btn${comment.isLiked ? " _comment_like_btn_active" : ""}`}
      onClick={handleClick}
      disabled={isPending}
      aria-label={comment.isLiked ? "Unlike comment" : "Like comment"}
      aria-pressed={comment.isLiked}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={comment.isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
      {comment.likesCount > 0 && (
        <span className="_comment_like_count">{comment.likesCount}</span>
      )}
    </button>
  );
};
