"use client";

import { useCallback, useId, useState } from "react";
import type { PostWithMeta } from "@/lib/repositories/post.repository";
import { PostLikeButton } from "@/components/feed/like-button";
import { CommentSection } from "@/components/feed/comment-section";
import { useCreateComment } from "@/hooks/feed/use-create-comment";
import { useSession } from "next-auth/react";
import { formatDistanceToNowStrict } from "@/lib/utils/date";

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm7.931 9h-2.764a14.67 14.67 0 0 0-1.792-6.243A8.013 8.013 0 0 1 19.931 11zM12.53 4.027c1.035 1.364 2.427 3.78 2.627 6.973H9.03c.139-2.596.994-5.028 2.451-6.974.172-.01.344-.026.519-.026.179 0 .354.016.53.027zm-3.842.7C7.704 6.618 7.136 8.762 7.03 11H4.069a8.013 8.013 0 0 1 4.619-6.273zM4.069 13h2.974c.136 2.379.665 4.478 1.556 6.23A8.01 8.01 0 0 1 4.069 13zm7.381 6.973C10.049 18.275 9.222 15.896 9.041 13h6.113c-.208 2.773-1.117 5.196-2.603 6.972-.182.012-.364.028-.551.028-.186 0-.367-.016-.55-.027zm4.011-.772c.955-1.794 1.538-3.901 1.691-6.201h2.778a8.005 8.005 0 0 1-4.469 6.201z" />
        </svg>
        Public
      </>
    ) : (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 4-2 8-2s4 2 8 2l1-4c-4 0-4-2-8-2-1.93 0-3.07.5-4 1z" />
          <path d="M8 10c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4z" />
        </svg>
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
  const { data: session } = useSession();

  const createComment = useCreateComment(post.id);

  const authorName =
    post.author.firstName && post.author.lastName
      ? `${post.author.firstName} ${post.author.lastName}`
      : (post.author.name ?? "Unknown");

  const timeAgo = formatDistanceToNowStrict(new Date(post.createdAt));

  const toggleDrop = useCallback(() => setDropOpen((v) => !v), []);
  const toggleComments = useCallback(() => setCommentOpen((v) => !v), []);

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
              {post.author.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.author.image}
                  alt={authorName}
                  className="_post_img"
                />
              ) : (
                <div className="_post_img _post_avatar_fallback" aria-hidden="true">
                  {authorName.slice(0, 1).toUpperCase()}
                </div>
              )}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="4"
                  height="17"
                  fill="none"
                  viewBox="0 0 4 17"
                >
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
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
                    <li key={item.label} className="_feed_timeline_dropdown_item">
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
            />
          </div>
        ) : null}
      </div>

      {/* ── Stats row ─────────────────────────────────────────────── */}
      {(post.likesCount > 0 || post.commentsCount > 0) && (
        <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
          {post.likesCount > 0 && (
            <div className="_feed_inner_timeline_total_reacts_image">
              <span className="_reaction_like_icon" aria-hidden="true">👍</span>
              <p className="_feed_inner_timeline_total_reacts_para">
                {post.likesCount}
              </p>
            </div>
          )}
          {post.commentsCount > 0 && (
            <div className="_feed_inner_timeline_total_reacts_txt">
              <button
                type="button"
                className="_feed_inner_timeline_total_reacts_para1 _plain_btn"
                onClick={toggleComments}
              >
                <span>{post.commentsCount}</span>{" "}
                {post.commentsCount === 1 ? "Comment" : "Comments"}
              </button>
            </div>
          )}
        </div>
      )}

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
              <svg
                className="_reaction_svg"
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                fill="none"
                viewBox="0 0 21 21"
              >
                <path
                  stroke="#000"
                  d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
                />
                <path
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.938 9.313h7.125M10.5 14.063h3.563"
                />
              </svg>
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
              <svg
                className="_reaction_svg"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="21"
                fill="none"
                viewBox="0 0 24 21"
              >
                <path
                  stroke="#000"
                  strokeLinejoin="round"
                  d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
                />
              </svg>
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
          currentUserImage={session?.user?.image ?? null}
          onAddComment={handleAddComment}
          isAddingComment={createComment.isPending}
        />
      </div>
    </article>
  );
};
