"use client";

import { useCallback, useState } from "react";
import {
  MoreOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  BookOutlined,
  BellOutlined,
  CloseSquareOutlined,
  EditOutlined,
  DeleteOutlined,
  AudioOutlined,
  PictureOutlined,
  HeartOutlined,
} from "@ant-design/icons";

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

/* ─── Dropdown (matches `capital/feed.html` `._feed_timeline_dropdown_*`) ───── */

const DROPDOWN_ITEMS = [
  {
    label: "Save Post",
    icon: <BookOutlined style={{ fontSize: 18, color: "#1890FF" }} />,
  },
  {
    label: "Turn On Notification",
    icon: <BellOutlined style={{ fontSize: 18, color: "#377DFF" }} />,
  },
  {
    label: "Hide",
    icon: <CloseSquareOutlined style={{ fontSize: 18, color: "#1890FF" }} />,
  },
  {
    label: "Edit Post",
    icon: <EditOutlined style={{ fontSize: 18, color: "#1890FF" }} />,
  },
  {
    label: "Delete Post",
    icon: <DeleteOutlined style={{ fontSize: 18, color: "#1890FF" }} />,
  },
] as const;

/* ─── Utilities ───────────────────────────────────────────────────────────── */

const reactionStackClass = (index: number) => {
  if (index === 0) return "_react_img1";
  if (index >= 2) return "_react_img _rect_img_mbl_none";
  return "_react_img";
};

/* ─── Sub-components (`capital/feed.html` comment markup) ─────────────────── */

type CommentComposerProps = {
  avatarSrc: string;
  textareaId: string;
};

const CommentComposer = ({ avatarSrc, textareaId }: CommentComposerProps) => (
  <div className="_feed_inner_comment_box">
    <form className="_feed_inner_comment_box_form">
      <div className="_feed_inner_comment_box_content">
        <div className="_feed_inner_comment_box_content_image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarSrc} alt="" className="_comment_img" />
        </div>
        <div className="_feed_inner_comment_box_content_txt">
          <textarea
            className="form-control _comment_textarea"
            placeholder="Write a comment"
            id={textareaId}
            rows={1}
          />
          <div className="_feed_inner_comment_box_icon">
            <button
              type="button"
              className="_feed_inner_comment_box_icon_btn"
              aria-label="Voice"
            >
              <AudioOutlined
                style={{ fontSize: 16, color: "rgba(0,0,0,0.46)" }}
              />
            </button>
            <button
              type="button"
              className="_feed_inner_comment_box_icon_btn"
              aria-label="Image"
            >
              <PictureOutlined
                style={{ fontSize: 16, color: "rgba(0,0,0,0.46)" }}
              />
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
);

const CommentThreadItem = ({
  comment,
  replyTextareaId,
}: {
  comment: CommentData;
  replyTextareaId: string;
}) => (
  <div className="_comment_main">
    <div className="_comment_image">
      <a href="#" className="_comment_image_link">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={comment.authorImage} alt="" className="_comment_img1" />
      </a>
    </div>
    <div className="_comment_area">
      <div className="_comment_details">
        <div className="_comment_details_top">
          <div className="_comment_name">
            <a href="#">
              <h4 className="_comment_name_title">{comment.authorName}</h4>
            </a>
          </div>
        </div>
        <div className="_comment_status">
          <p className="_comment_status_text">
            <span>{comment.text}</span>
          </p>
        </div>
        <div className="_total_reactions">
          <div className="_total_react">
            <span className="_reaction_like">
              <LikeOutlined style={{ fontSize: 16 }} />
            </span>
            <span className="_reaction_heart">
              <HeartOutlined style={{ fontSize: 16 }} />
            </span>
          </div>
          <span className="_total">{comment.reactions}</span>
        </div>
        <div className="_comment_reply">
          <div className="_comment_reply_num">
            <ul className="_comment_reply_list">
              <li>
                <span>Like.</span>
              </li>
              <li>
                <span>Reply.</span>
              </li>
              <li>
                <span>Share</span>
              </li>
              <li>
                <span className="_time_link">.{comment.time}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <CommentComposer
        avatarSrc="/assets/images/comment_img.png"
        textareaId={replyTextareaId}
      />
    </div>
  </div>
);

/* ─── Main component (`capital/feed.html` `._feed_inner_timeline_post_area`) ─ */

type TimelinePostProps = {
  post: PostData;
};

/**
 * Timeline post card — DOM and class names aligned with `capital/feed.html`.
 */
export const TimelinePost = ({ post }: TimelinePostProps) => {
  const [dropOpen, setDropOpen] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>("Like");

  const toggleDrop = useCallback(() => setDropOpen((prev) => !prev), []);

  const handleLike = useCallback(() => {
    setActiveReaction((prev) => (prev === "Like" ? null : "Like"));
  }, []);

  const topCommentId = `timeline-comment-${post.id}`;

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.authorImage} alt="" className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {post.authorName}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                {post.meta} . <a href="#">Public</a>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <button
                type="button"
                className="_feed_timeline_post_dropdown_link"
                onClick={toggleDrop}
                aria-label="Post options"
              >
                <MoreOutlined style={{ fontSize: 18, color: "#C4C4C4" }} />
              </button>
            </div>
            <div className={`_feed_timeline_dropdown${dropOpen ? "show" : ""}`}>
              <ul className="_feed_timeline_dropdown_list">
                {DROPDOWN_ITEMS.map((item) => (
                  <li key={item.label} className="_feed_timeline_dropdown_item">
                    <a
                      href="#"
                      className="_feed_timeline_dropdown_link"
                      onClick={() => setDropOpen(false)}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {post.title ? (
          <h4 className="_feed_inner_timeline_post_title">{post.title}</h4>
        ) : null}
        {post.image ? (
          <div className="_feed_inner_timeline_image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt="" className="_time_img" />
          </div>
        ) : null}
      </div>

      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          {post.reactionImages.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className={reactionStackClass(i)} />
          ))}
          <p className="_feed_inner_timeline_total_reacts_para">
            {post.reactionCount}
          </p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <a href="#">
              <span>{post.commentCount}</span> Comment
            </a>
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2">
            <span>{post.shareCount}</span> Share
          </p>
        </div>
      </div>

      <div className="_feed_inner_timeline_reaction">
        <button
          type="button"
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction${activeReaction === "Like" ? "_feed_reaction_active" : ""}`}
          onClick={handleLike}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <LikeOutlined style={{ fontSize: 19 }} />
              Like
            </span>
          </span>
        </button>
        <button
          type="button"
          className="_feed_inner_timeline_reaction_comment _feed_reaction"
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

      <div className="_feed_inner_timeline_cooment_area">
        <CommentComposer
          avatarSrc="/assets/images/comment_img.png"
          textareaId={topCommentId}
        />
      </div>

      {post.comments.length > 0 ? (
        <div className="_timline_comment_main">
          <div className="_previous_comment">
            <button type="button" className="_previous_comment_txt">
              View 4 previous comments
            </button>
          </div>
          {post.comments.map((comment) => (
            <CommentThreadItem
              key={comment.id}
              comment={comment}
              replyTextareaId={`timeline-reply-${post.id}-${comment.id}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
