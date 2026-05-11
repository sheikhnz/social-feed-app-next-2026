"use client";

import { useCallback } from "react";
import type { PostWithMeta } from "@/lib/repositories/post.repository";
import type { CommentWithMeta } from "@/lib/repositories/comment.repository";
import { useLikePost } from "@/hooks/feed/use-like";
import { useLikeComment } from "@/hooks/feed/use-like";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";

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
          {post.isLiked ? (
            <LikeFilled style={{ fontSize: 19 }} />
          ) : (
            <LikeOutlined style={{ fontSize: 19 }} />
          )}
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
  /** Pass the parent comment id when this button belongs to a reply. */
  parentCommentId?: string;
};

export const CommentLikeButton = ({
  comment,
  parentCommentId,
}: CommentLikeButtonProps) => {
  const { like, unlike, isPending } = useLikeComment(
    comment.id,
    comment.postId,
    parentCommentId,
  );

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
      {comment.isLiked ? (
        <LikeFilled style={{ fontSize: 14 }} />
      ) : (
        <LikeOutlined style={{ fontSize: 14 }} />
      )}
      {comment.likesCount > 0 && (
        <span className="_comment_like_count">{comment.likesCount}</span>
      )}
    </button>
  );
};
