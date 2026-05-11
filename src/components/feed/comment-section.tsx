"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import type { CommentWithMeta } from "@/lib/repositories/comment.repository";
import { useComments } from "@/hooks/feed/use-comments";
import { useReplies } from "@/hooks/feed/use-replies";
import { useCreateComment } from "@/hooks/feed/use-create-comment";
import { CommentLikeButton } from "@/components/feed/like-button";
import { ReplyInput, type ComposerAvatarUser } from "@/components/feed/reply-input";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatDistanceToNowStrict } from "@/lib/utils/date";
import { Tooltip } from "@/components/ui/antd";
import { SendOutlined } from "@ant-design/icons";

// ---------------------------------------------------------------------------
// Individual comment item (top-level or reply)
// ---------------------------------------------------------------------------

type CommentItemProps = {
  comment: CommentWithMeta;
  postId: string;
  /** Depth: 0 = top-level, 1 = reply */
  depth?: number;
  /** Id of the parent comment — required when depth > 0 to correctly update the replies cache */
  parentCommentId?: string;
  /** Logged-in user for reply composer avatar (image or initials while typing). */
  composerUser?: ComposerAvatarUser | null;
};

const CommentItem = ({
  comment,
  postId,
  depth = 0,
  parentCommentId,
  composerUser,
}: CommentItemProps) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);

  const { replies, isLoading: repliesLoading } = useReplies(
    comment.id,
    repliesOpen,
  );

  const createReply = useCreateComment(postId);

  const authorName =
    comment.author.firstName && comment.author.lastName
      ? `${comment.author.firstName} ${comment.author.lastName}`
      : (comment.author.name ?? "Unknown");

  const handleReplySubmit = useCallback(
    (content: string) => {
      createReply.mutate(
        {
          postId,
          content,
          parentCommentId: comment.id,
        },
        {
          onSuccess: () => {
            setReplyOpen(false);
            setRepliesOpen(true); // auto-open replies so the new one is visible
          },
        },
      );
    },
    [createReply, postId, comment.id],
  );

  return (
    <div className={`_comment_main${depth > 0 ? " _comment_reply_item" : ""}`}>
      <div className="_comment_image">
        <a href="#" className="_comment_image_link" tabIndex={-1}>
          {comment.author.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={comment.author.image}
              alt={authorName}
              className="_comment_img1"
            />
          ) : (
            <div
              className="_comment_img1 _comment_avatar_fallback"
              aria-hidden="true"
            >
              {authorName.slice(0, 1).toUpperCase()}
            </div>
          )}
        </a>
      </div>

      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <h4 className="_comment_name_title">{authorName}</h4>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.content}</span>
            </p>
          </div>

          <div className="_comment_actions_row">
            <CommentLikeButton comment={comment} parentCommentId={parentCommentId} />

            <button
              type="button"
              className="_comment_action_link"
              onClick={() => setReplyOpen((v) => !v)}
            >
              Reply
            </button>

            <span className="_comment_time">
              {formatDistanceToNowStrict(new Date(comment.createdAt))}
            </span>

            {comment.likesCount > 0 && (
              <Tooltip
                title={
                  comment.recentLikers && comment.recentLikers.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      {comment.recentLikers.map(l => (
                        <span key={l.id}>• {l.name || [l.firstName, l.lastName].filter(Boolean).join(" ") || "Someone"}</span>
                      ))}
                      {comment.likesCount > comment.recentLikers.length && (
                        <span>• and {comment.likesCount - comment.recentLikers.length} others</span>
                      )}
                    </div>
                  ) : (
                    `${comment.likesCount} likes`
                  )
                }
                placement="top"
              >
                <span className="_comment_like_meta cursor-pointer">
                  {comment.likesCount} like{comment.likesCount !== 1 ? "s" : ""}
                </span>
              </Tooltip>
            )}
          </div>

          {/* Replies toggle — shown at any depth */}
          {comment.repliesCount > 0 && (
            <button
              type="button"
              className="_previous_comment_txt"
              onClick={() => setRepliesOpen((v) => !v)}
              style={{ marginTop: 4 }}
            >
              {repliesOpen
                ? "Hide replies"
                : `View ${comment.repliesCount} ${comment.repliesCount === 1 ? "reply" : "replies"}`}
            </button>
          )}

          {repliesLoading && (
            <div className="_skeleton _skeleton_line" style={{ width: "60%", marginTop: 8 }} />
          )}

          {repliesOpen && replies.length > 0 && (
            <div className="_comment_replies_list">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  depth={1}
                  parentCommentId={comment.id}
                  composerUser={composerUser}
                />
              ))}
            </div>
          )}

          {replyOpen && (
            <ReplyInput
              parentCommentId={comment.id}
              postId={postId}
              onSubmit={handleReplySubmit}
              isPending={createReply.isPending}
              composerUser={composerUser}
              placeholder={`Reply to ${authorName}…`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// CommentSection — lazy loads when isOpen = true
// ---------------------------------------------------------------------------

type CommentSectionProps = {
  postId: string;
  isOpen: boolean;
  onAddComment: (content: string) => void;
  isAddingComment?: boolean;
};

export const CommentSection = ({
  postId,
  isOpen,
  onAddComment,
  isAddingComment,
}: CommentSectionProps) => {
  const { data: session } = useSession();
  const composerUser: ComposerAvatarUser | null = session?.user
    ? {
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        name: session.user.name,
        image: session.user.image,
      }
    : null;
  const { comments, isLoading, isFetchingNextPage, hasNextPage, loadMoreRef } =
    useComments(postId, isOpen);

  if (!isOpen) return null;

  return (
    <div className="_feed_inner_timeline_cooment_area">
      {/* Composer for new top-level comment */}
      <div className="_feed_inner_comment_box">
        <div className="_feed_inner_comment_box_content">
          <div className="_feed_inner_comment_box_content_image">
            <UserAvatar
              user={composerUser ?? undefined}
              size={36}
              className="_comment_img"
              fallbackClassName="_comment_avatar_fallback"
            />
          </div>
          <div className="_feed_inner_comment_box_content_txt">
            <CommentComposerInput
              onSubmit={onAddComment}
              isPending={isAddingComment}
            />
          </div>
        </div>
      </div>

      {/* Comment thread */}
      {isLoading ? (
        <div className="_comments_loading" aria-label="Loading comments">
          {[1, 2].map((i) => (
            <div key={i} className="_comment_main" style={{ marginTop: 12 }}>
              <div className="_skeleton _skeleton_avatar_sm" />
              <div style={{ flex: 1, marginLeft: 10 }}>
                <div className="_skeleton _skeleton_line" style={{ width: "30%", marginBottom: 6 }} />
                <div className="_skeleton _skeleton_line" style={{ width: "80%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="_timline_comment_main">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              composerUser={composerUser}
            />
          ))}

          {hasNextPage && (
            <button
              ref={loadMoreRef}
              type="button"
              className="_previous_comment_txt"
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading…" : "Load more comments"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Internal: inline comment textarea
// ---------------------------------------------------------------------------

const CommentComposerInput = ({
  onSubmit,
  isPending,
}: {
  onSubmit: (text: string) => void;
  isPending?: boolean;
}) => {
  const [text, setText] = useState("");

  const submit = () => {
    const t = text.trim();
    if (!t || isPending) return;
    onSubmit(t);
    setText("");
  };

  return (
    <>
      <textarea
        className="form-control _comment_textarea"
        placeholder="Write a comment…"
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            submit();
          }
        }}
        disabled={isPending}
        aria-label="Write a comment"
      />
      <div className="_feed_inner_comment_box_icon">
        <button
          type="button"
          className="_feed_inner_comment_box_icon_btn"
          onClick={submit}
          disabled={!text.trim() || isPending}
          aria-label="Post comment"
        >
          <SendOutlined
            style={{
              fontSize: 14,
              color: text.trim() ? "#1890ff" : "rgba(0,0,0,0.46)",
              transform: "rotate(-45deg)",
            }}
          />
        </button>
      </div>
    </>
  );
};
