"use client";

import { useCallback, useRef, useState } from "react";

/* ─── Types ───────────────────────────────────────────────────────────────── */

type CommentData = {
  id: number;
  authorName: string;
  authorImage: string;
  text: string;
  reactions: number;
  time: string;
};

type PostData = {
  id: number;
  authorName: string;
  authorImage: string;
  meta: string;
  title?: string;
  image?: string;
  reactionImages: string[];
  reactionCount: string;
  commentCount: number;
  shareCount: number;
  comments: CommentData[];
};

/* ─── Dropdown menu items ─────────────────────────────────────────────────── */

const DROPDOWN_ITEMS = [
  {
    label: "Save Post",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" />
      </svg>
    ),
  },
  {
    label: "Turn On Notification",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413" />
      </svg>
    ),
  },
  {
    label: "Hide",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5" />
      </svg>
    ),
  },
  {
    label: "Edit Post",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z" />
      </svg>
    ),
  },
  {
    label: "Delete Post",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5" />
      </svg>
    ),
  },
] as const;

/* ─── Sub-components ──────────────────────────────────────────────────────── */

const CommentInput = ({ avatarSrc }: { avatarSrc: string }) => (
  <div className="_comment_input_row">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={avatarSrc} alt="" className="_comment_avatar" />
    <div className="_comment_input_wrap">
      <textarea className="_comment_input" placeholder="Write a comment" rows={1} />
      <div className="_comment_input_icons">
        <button type="button" className="_comment_icon_btn" aria-label="Voice">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path
              d="M8 1.25a2 2 0 012 2v4a2 2 0 11-4 0v-4a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
            <path
              d="M3.5 7v.75a4.5 4.5 0 009 0V7M8 13.25V15M6.25 15h3.5"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button type="button" className="_comment_icon_btn" aria-label="Image">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path
              d="M2.5 4a2 2 0 012-2h7a2 2 0 012 2v8a2 2 0 01-2 2h-7a2 2 0 01-2-2V4z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
            <circle cx="6.25" cy="6.25" r="1.1" stroke="currentColor" strokeWidth="1.25" />
            <path
              d="M3 12 6 9l1.75 1.75L11 7.5l2 2"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

const CommentItem = ({ comment }: { comment: CommentData }) => (
  <div className="_comment_item">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={comment.authorImage} alt={comment.authorName} className="_comment_avatar" />
    <div className="_comment_body">
      <div className="_comment_bubble">
        <a href="#" className="_comment_author">{comment.authorName}</a>
        <p className="_comment_text">{comment.text}</p>
      </div>
      <div className="_comment_meta">
        <div className="_comment_reaction_icons">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
        </div>
        <span className="_comment_action_link">{comment.reactions}</span>
        <span style={{ color: "var(--bs-color3)", margin: "0 4px" }}>·</span>
        <button type="button" className="_comment_action_link">Like.</button>
        <span style={{ color: "var(--bs-color3)", margin: "0 4px" }}>·</span>
        <button type="button" className="_comment_action_link">Reply.</button>
        <span style={{ color: "var(--bs-color3)", margin: "0 4px" }}>·</span>
        <button type="button" className="_comment_action_link">Share</button>
        <span style={{ color: "var(--bs-color3)", margin: "0 4px" }}>·</span>
        <span className="_comment_time">{comment.time}</span>
      </div>
    </div>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */

type TimelinePostProps = {
  post: PostData;
};

/**
 * Individual timeline post card with reactions, comment section, and dropdown menu.
 */
export const TimelinePost = ({ post }: TimelinePostProps) => {
  const [dropOpen, setDropOpen] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>("Like");
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleDrop = useCallback(() => setDropOpen((prev) => !prev), []);

  const handleReaction = useCallback((reaction: string) => {
    setActiveReaction((prev) => (prev === reaction ? null : reaction));
  }, []);

  return (
    <div className="_post_card">
      {/* Header */}
      <div className="_post_card_header">
        <div className="_post_author_info">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.authorImage} alt={post.authorName} className="_post_author_avatar" />
          <div>
            <h4 className="_post_author_name">{post.authorName}</h4>
            <p className="_post_meta">
              {post.meta} · <a href="#">Public</a>
            </p>
          </div>
        </div>

        {/* 3-dot menu */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button type="button" className="_post_menu_btn" onClick={toggleDrop} aria-label="Post options">
            <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
              <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
              <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
              <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
            </svg>
          </button>
          <div className={`_post_dropdown${dropOpen ? " show" : ""}`}>
            {DROPDOWN_ITEMS.map((item) => (
              <a key={item.label} href="#" className="_post_dropdown_item">
                <span style={{ display: "flex" }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Post title */}
      {post.title && <h4 className="_post_title">{post.title}</h4>}

      {/* Post image */}
      {post.image && (
        <div className="_post_image_wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt="" />
        </div>
      )}

      {/* Reaction counts */}
      <div className="_post_reactions_row">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="_post_reaction_emojis">
            {post.reactionImages.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="_post_reaction_emoji_img" />
            ))}
          </div>
          <span className="_post_reaction_count">{post.reactionCount}</span>
        </div>
        <div className="_post_stats">
          <a href="#" className="_post_stat_link">
            <span>{post.commentCount}</span> Comment
          </a>
          <span className="_post_stat_link">
            <span>{post.shareCount}</span> Share
          </span>
        </div>
      </div>

      {/* Reaction buttons */}
      <div className="_post_action_row">
        <button
          type="button"
          className={`_reaction_btn${activeReaction === "Like" ? " _reaction_btn_active" : ""}`}
          onClick={() => handleReaction("Like")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12.73 4A2 2 0 0 1 16.38 3H17a1 1 0 0 1 1 1v2" />
          </svg>
          Like
        </button>
        <button
          type="button"
          className="_reaction_btn"
          onClick={() => handleReaction("Comment")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
            <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
            <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
          </svg>
          Comment
        </button>
        <button type="button" className="_reaction_btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
            <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
          </svg>
          Share
        </button>
      </div>

      {/* Comments */}
      <div className="_comment_area">
        <CommentInput avatarSrc="/assets/images/comment_img.png" />

        {post.comments.length > 0 && (
          <>
            <button type="button" className="_prev_comments_btn">
              View {post.comments.length} previous comments
            </button>
            {post.comments.map((comment) => (
              <div key={comment.id}>
                <CommentItem comment={comment} />
                <div style={{ paddingLeft: 46, marginTop: 8, marginBottom: 8 }}>
                  <CommentInput avatarSrc="/assets/images/comment_img.png" />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
