"use client";

import { useState } from "react";
import Image from "next/image";

/* ─── Post action buttons config ─────────────────────────────────────────── */

const POST_ACTIONS = [
  {
    label: "Photo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path
          d="M3 6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="8.5" cy="8.5" r="1.75" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4 15.5 8 11l2 2 3.5-3.5L16 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Video",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
        <path
          d="M4 7a2 2 0 012-2h7a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M17 10l4-2.5v9L17 14v-4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Event",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
        <path
          d="M16 3v3M8 3v3M4.5 9h15M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Article",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="none" viewBox="0 0 18 20">
        <path
          d="M5 2h8a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M6 7h6M6 10h6M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

/**
 * Create a post card — textarea input plus action buttons (photo, video, event, article).
 */
export const CreatePost = () => {
  const [text, setText] = useState("");

  return (
    <div className="_create_post_card">
      <div className="_create_post_top">
        <Image
          src="/assets/images/txt_img.png"
          alt="Your avatar"
          width={40}
          height={40}
          className="_create_post_avatar"
        />
        <div className="_create_post_textarea_wrap">
          <textarea
            className="_create_post_textarea"
            placeholder="Write something ..."
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>

      <div className="_create_post_actions">
        <div className="_post_action_btns">
          {POST_ACTIONS.map((action) => (
            <button key={action.label} type="button" className="_post_action_btn">
              <span style={{ display: "flex" }}>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
        <button type="button" className="_post_submit_btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
            <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88z" clipRule="evenodd" />
          </svg>
          <span>Post</span>
        </button>
      </div>
    </div>
  );
};
