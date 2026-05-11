"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { SendOutlined } from "@ant-design/icons";
import { UserAvatar } from "@/components/ui/user-avatar";

/** Same shape NextAuth attaches to `session.user`; used only for avatar + initials fallback. */
export type ComposerAvatarUser = {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  image?: string | null;
};

type ReplyInputProps = {
  /** The parent comment's id */
  parentCommentId: string;
  postId: string;
  /** Called with the reply text when submitted */
  onSubmit: (content: string) => void;
  isPending?: boolean;
  /** Current user for inline avatar (image or letter fallback). */
  composerUser?: ComposerAvatarUser | null;
  placeholder?: string;
};

/**
 * Inline reply composer — appears below a comment when "Reply" is clicked.
 */
export const ReplyInput = ({
  onSubmit,
  isPending,
  composerUser,
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
            <UserAvatar
              user={composerUser ?? undefined}
              size={36}
              className="_comment_img"
              fallbackClassName="_comment_avatar_fallback"
            />
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
                <SendOutlined
                  style={{
                    fontSize: 14,
                    color: text.trim() ? "#1890ff" : "rgba(0,0,0,0.46)",
                    transform: "rotate(-45deg)",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
