"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";

type ReplyInputProps = {
  /** The parent comment's id */
  parentCommentId: string;
  postId: string;
  /** Called with the reply text when submitted */
  onSubmit: (content: string) => void;
  isPending?: boolean;
  avatarSrc?: string | null;
  placeholder?: string;
};

/**
 * Inline reply composer — appears below a comment when "Reply" is clicked.
 */
export const ReplyInput = ({
  onSubmit,
  isPending,
  avatarSrc,
  placeholder = "Write a reply…",
}: ReplyInputProps) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;
    onSubmit(trimmed);
    setText("");
  }, [text, isPending, onSubmit]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="_reply_input_wrap">
      <div className="_feed_inner_comment_box">
        <div className="_feed_inner_comment_box_content">
          <div className="_feed_inner_comment_box_content_image">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarSrc} alt="" className="_comment_img" />
            ) : (
              <div className="_comment_avatar_placeholder" aria-hidden="true" />
            )}
          </div>
          <div className="_feed_inner_comment_box_content_txt">
            <textarea
              ref={textareaRef}
              className="form-control _comment_textarea"
              placeholder={placeholder}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label={placeholder}
              disabled={isPending}
            />
            <div className="_feed_inner_comment_box_icon">
              <button
                type="button"
                className="_feed_inner_comment_box_icon_btn _reply_send_btn"
                onClick={handleSubmit}
                disabled={!text.trim() || isPending}
                aria-label="Send reply"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 14 13"
                >
                  <path
                    fill={text.trim() ? "#1890ff" : "#000"}
                    fillOpacity={text.trim() ? 1 : 0.46}
                    fillRule="evenodd"
                    d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
