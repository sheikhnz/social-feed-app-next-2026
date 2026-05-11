"use client";

import { useCallback, useId, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCreatePost } from "@/hooks/feed/use-create-post";
import {
  PictureOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SendOutlined,
} from "@ant-design/icons";

const PLACEHOLDER_FLOAT = "\u00a0";
const LABEL_TEXT = "Write something ...";

/* ─── Icons ────────────────────────────────────────────────────────────────── */

const ATTACHMENT_BTNS = [
  { key: "photo", label: "Photo", className: "_feed_inner_text_area_bottom_photo", icon: <PictureOutlined style={{ fontSize: 20, color: "#666" }} /> },
  { key: "video", label: "Video", className: "_feed_inner_text_area_bottom_video", icon: <VideoCameraOutlined style={{ fontSize: 20, color: "#666" }} /> },
  { key: "event", label: "Event", className: "_feed_inner_text_area_bottom_event", icon: <CalendarOutlined style={{ fontSize: 20, color: "#666" }} /> },
  { key: "article", label: "Article", className: "_feed_inner_text_area_bottom_article", icon: <FileTextOutlined style={{ fontSize: 20, color: "#666" }} /> },
] as const;

/* ─── Visibility selector ─────────────────────────────────────────────────── */

type Visibility = "PUBLIC" | "PRIVATE";

const VisibilityToggle = ({
  value,
  onChange,
}: {
  value: Visibility;
  onChange: (v: Visibility) => void;
}) => (
  <div className="_composer_visibility_toggle">
    <button
      type="button"
      className={`_composer_vis_btn${value === "PUBLIC" ? " _active" : ""}`}
      onClick={() => onChange("PUBLIC")}
      aria-pressed={value === "PUBLIC"}
    >
      🌐 Public
    </button>
    <button
      type="button"
      className={`_composer_vis_btn${value === "PRIVATE" ? " _active" : ""}`}
      onClick={() => onChange("PRIVATE")}
      aria-pressed={value === "PRIVATE"}
    >
      🔒 Private
    </button>
  </div>
);

/* ─── PostComposer ────────────────────────────────────────────────────────── */

/**
 * Create-post composer wired to the real API.
 * Optimistically inserts the post at the top of the feed on submit.
 */
export const PostComposer = () => {
  const reactId = useId();
  const fieldId = `feed-create-post-${reactId}`;
  const [text, setText] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const { data: session } = useSession();

  const createPost = useCreatePost({
    onSuccess: () => {
      setText("");
      toast.success("Post published!");
    },
  });

  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    const content = text.trim();
    if (!content || createPost.isPending) return;
    createPost.mutate({ content, visibility });
  }, [text, visibility, createPost]);

  const authorImage = session?.user?.image;
  const authorName = session?.user?.name ?? "You";

  return (
    <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
      <div className="_feed_inner_text_area_box">
        <div className="_feed_inner_text_area_box_image">
          {authorImage ? (
            <Image
              src={authorImage}
              alt={authorName}
              width={40}
              height={40}
              className="_txt_img"
            />
          ) : (
            <div className="_txt_img _post_avatar_fallback" aria-hidden="true">
              {authorName.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="form-floating _feed_inner_text_area_box_form" style={{ position: "relative" }}>
          <textarea
            id={fieldId}
            className="form-control _textarea"
            placeholder={PLACEHOLDER_FLOAT}
            aria-label={LABEL_TEXT}
            rows={5}
            value={text}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={createPost.isPending}
          />
          <label className="_feed_textarea_label" htmlFor={fieldId}>
            {LABEL_TEXT}
          </label>
          <div className="_composer_visibility_overlay">
            <VisibilityToggle value={visibility} onChange={setVisibility} />
          </div>
        </div>
      </div>

      <div className="_feed_inner_text_area_bottom">
        <div className="_feed_inner_text_area_item">
          {ATTACHMENT_BTNS.map(({ key, label, className, icon }) => (
            <div key={key} className={`${className} _feed_common`}>
              <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">{icon}</span>
                {label}
              </button>
            </div>
          ))}
        </div>

        <div className="_composer_controls_right">
          <div className="_feed_inner_text_area_btn">
            <button
              type="button"
              className="_feed_inner_text_area_btn_link"
              onClick={handleSubmit}
              disabled={!text.trim() || createPost.isPending}
              aria-label="Publish post"
            >
              <SendOutlined className="_mar_img" style={{ fontSize: 14, color: "#fff", transform: "rotate(-45deg)" }} />
              <span>{createPost.isPending ? "Posting…" : "Post"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile strip */}
      <div className="_feed_inner_text_area_bottom_mobile">
        <div className="_feed_inner_text_mobile">
          <div className="_feed_inner_text_area_item">
            {ATTACHMENT_BTNS.map(({ key, label, className, icon }) => (
              <div key={key} className={`${className} _feed_common`}>
                <button type="button" className="_feed_inner_text_area_bottom_photo_link" aria-label={label}>
                  <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">{icon}</span>
                </button>
              </div>
            ))}
          </div>
          <div className="_feed_inner_text_area_btn">
            <button
              type="button"
              className="_feed_inner_text_area_btn_link"
              onClick={handleSubmit}
              disabled={!text.trim() || createPost.isPending}
              aria-label="Publish post"
            >
              <SendOutlined className="_mar_img" style={{ fontSize: 14, color: "#fff", transform: "rotate(-45deg)" }} />
              <span>{createPost.isPending ? "…" : "Post"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep legacy named export for backward compatibility
export { PostComposer as CreatePost };
