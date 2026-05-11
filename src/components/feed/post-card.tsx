"use client";

import { useCallback, useId, useState } from "react";
import type { PostWithMeta } from "@/lib/repositories/post.repository";
import { PostLikeButton } from "@/components/feed/like-button";
import { CommentSection } from "@/components/feed/comment-section";
import { useCreateComment } from "@/hooks/feed/use-create-comment";
import { formatDistanceToNowStrict } from "@/lib/utils/date";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Tooltip } from "@/components/ui/antd";
import {
  GlobalOutlined,
  LockOutlined,
  MoreOutlined,
  MessageOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

// ---------------------------------------------------------------------------
// Dropdown menu items
// ---------------------------------------------------------------------------

const DROPDOWN_ITEMS = [
  { label: "Save Post", icon: "🔖" },
  { label: "Turn On Notification", icon: "🔔" },
  { label: "Hide", icon: "🚫" },
] as const;

// ---------------------------------------------------------------------------
// Visibility badge
// ---------------------------------------------------------------------------

const VisibilityBadge = ({
  visibility,
}: {
  visibility: "PUBLIC" | "PRIVATE";
}) => (
  <span
    className={`_visibility_badge _visibility_badge_${visibility.toLowerCase()}`}
    aria-label={`Visibility: ${visibility}`}
  >
    {visibility === "PUBLIC" ? (
      <>
        <GlobalOutlined aria-hidden="true" />
        Public
      </>
    ) : (
      <>
        <LockOutlined aria-hidden="true" />
        Private
      </>
    )}
  </span>
);

// ---------------------------------------------------------------------------
// PostCard
// ---------------------------------------------------------------------------

type PostCardProps = {
  post: PostWithMeta;
};

/**
 * Full post card — author info, image, reactions, like, comment with live data.
 */
export const PostCard = ({ post }: PostCardProps) => {
  const uid = useId();
  const [dropOpen, setDropOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);

  const authorName =
    post.author.firstName && post.author.lastName
      ? `${post.author.firstName} ${post.author.lastName}`
      : (post.author.name ?? "Unknown");

  const timeAgo = formatDistanceToNowStrict(new Date(post.createdAt));

  const toggleDrop = useCallback(() => setDropOpen((v) => !v), []);
  const toggleComments = useCallback(() => setCommentOpen((v) => !v), []);

  const createComment = useCreateComment(post.id);

  const handleAddComment = useCallback(
    (content: string) => {
      createComment.mutate({ postId: post.id, content });
    },
    [createComment, post.id],
  );

  return (
    <article
      className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16"
      aria-label={`Post by ${authorName}`}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <UserAvatar
                user={post.author}
                size={42}
                className="_post_img"
                fallbackClassName="_post_avatar_fallback"
              />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {authorName}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                {timeAgo} ·{" "}
                <VisibilityBadge
                  visibility={post.visibility as "PUBLIC" | "PRIVATE"}
                />
              </p>
            </div>
          </div>

          {/* Dropdown */}
          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <button
                type="button"
                className="_feed_timeline_post_dropdown_link"
                onClick={toggleDrop}
                aria-label="Post options"
                aria-expanded={dropOpen}
                id={`${uid}-dropdown-btn`}
              >
                <MoreOutlined style={{ fontSize: 18, color: "#C4C4C4" }} />
              </button>
            </div>
            {dropOpen && (
              <div
                className="_feed_timeline_dropdownshow"
                role="menu"
                aria-labelledby={`${uid}-dropdown-btn`}
              >
                <ul className="_feed_timeline_dropdown_list">
                  {DROPDOWN_ITEMS.map((item) => (
                    <li
                      key={item.label}
                      className="_feed_timeline_dropdown_item"
                    >
                      <button
                        type="button"
                        className="_feed_timeline_dropdown_link"
                        role="menuitem"
                        onClick={() => setDropOpen(false)}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────── */}
        <p className="_feed_inner_timeline_post_body">{post.content}</p>

        {post.imageUrl ? (
          <div className="_feed_inner_timeline_image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt="Post attachment"
              className="_time_img"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}
      </div>

      {/* ── Stats row ─────────────────────────────────────────────── */}
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        {post.likesCount > 0 && (
          <Tooltip
            title={
              post.recentLikers && post.recentLikers.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  {post.recentLikers.map((l) => (
                    <span key={l.id}>
                      •{" "}
                      {l.name ||
                        [l.firstName, l.lastName].filter(Boolean).join(" ") ||
                        "Someone"}
                    </span>
                  ))}
                  {post.likesCount > post.recentLikers.length && (
                    <span>
                      • and {post.likesCount - post.recentLikers.length} others
                    </span>
                  )}
                </div>
              ) : (
                `${post.likesCount} likes`
              )
            }
            placement="top"
          >
            <div className="_feed_inner_timeline_total_reacts_image cursor-pointer">
              {post.recentLikers?.map((liker, i) => {
                const zIndex = 10 - i;
                return (
                  <UserAvatar
                    key={liker.id}
                    user={liker}
                    size={24}
                    className={i === 0 ? "_react_img1" : "_react_img"}
                    fallbackClassName="_react_avatar_fallback"
                    style={{ zIndex }}
                  />
                );
              })}
              {post.likesCount > (post.recentLikers?.length || 0) && (
                <div className="_react_count_badge" style={{ zIndex: 0 }}>
                  {post.likesCount - (post.recentLikers?.length || 0)}+
                </div>
              )}
            </div>
          </Tooltip>
        )}
        <div className="_feed_inner_timeline_total_reacts_txt">
          <button
            type="button"
            className="_feed_inner_timeline_total_reacts_para1 _plain_btn"
            onClick={toggleComments}
          >
            <span>{post.commentsCount}</span>{" "}
            {post.commentsCount === 1 ? "Comment" : "Comments"}
          </button>
          <button
            type="button"
            className="_feed_inner_timeline_total_reacts_para1 _plain_btn"
          >
            <span>0</span> Share
          </button>
        </div>
      </div>

      {/* ── Reaction bar ──────────────────────────────────────────── */}
      <div className="_feed_inner_timeline_reaction">
        <PostLikeButton post={post} />

        <button
          type="button"
          className="_feed_inner_timeline_reaction_comment _feed_reaction"
          onClick={toggleComments}
          aria-expanded={commentOpen}
          aria-controls={`${uid}-comments`}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <MessageOutlined
                className="_reaction_svg"
                style={{ fontSize: 20 }}
              />
              Comment
            </span>
          </span>
        </button>

        <button
          type="button"
          className="_feed_inner_timeline_reaction_share _feed_reaction"
          aria-label="Share post"
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <ShareAltOutlined
                className="_reaction_svg"
                style={{ fontSize: 20 }}
              />
              Share
            </span>
          </span>
        </button>
      </div>

      {/* ── Comments ──────────────────────────────────────────────── */}
      <div id={`${uid}-comments`}>
        <CommentSection
          postId={post.id}
          isOpen={commentOpen}
          onAddComment={handleAddComment}
          isAddingComment={createComment.isPending}
        />
      </div>
    </article>
  );
};
