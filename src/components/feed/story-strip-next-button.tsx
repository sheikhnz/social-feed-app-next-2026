"use client";
import { RightOutlined } from "@ant-design/icons";

const SHOW_MORE_STORIES_LABEL = "Show more stories";

/**
 * Same structure and icon as `capital/feed.html` (`._feed_inner_story_arrow` + `._feed_inner_story_arrow_btn`).
 */
export const StoryStripNextButton = () => {
  const handleClick = () => {
    const row = document.getElementById("story-scroll-row");
    if (row) {
      row.scrollBy({ left: row.clientWidth * 0.85, behavior: "smooth" });
    }
  };

  return (
    <div className="_feed_inner_story_arrow">
      <button
        type="button"
        className="_feed_inner_story_arrow_btn"
        aria-label={SHOW_MORE_STORIES_LABEL}
        onClick={handleClick}
      >
        <RightOutlined style={{ fontSize: 9, color: "#fff" }} />
      </button>
    </div>
  );
};
