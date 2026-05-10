"use client";

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
        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8" aria-hidden>
          <path
            fill="#fff"
            d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z"
          />
        </svg>
      </button>
    </div>
  );
};
