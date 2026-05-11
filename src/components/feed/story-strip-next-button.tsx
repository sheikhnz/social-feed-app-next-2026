"use client";

import { useCallback, useEffect, useState } from "react";
import { RightOutlined } from "@ant-design/icons";

const SHOW_MORE_STORIES_LABEL = "Show more stories";

const DEFAULT_SCROLL_TARGET_ID = "story-scroll-row";

type StoryStripNextButtonArgs = {
  /** DOM id of the horizontally scrollable story row (must match `id` on the strip). */
  scrollTargetId?: string;
};

/**
 * Next control for the story strip — scrolls the row on desktop when content overflows.
 * Hidden automatically when the strip fits (no overflow) or on mobile (CSS hides `._feed_inner_story_arrow`).
 */
export const StoryStripNextButton = ({
  scrollTargetId = DEFAULT_SCROLL_TARGET_ID,
}: StoryStripNextButtonArgs) => {
  const [showArrow, setShowArrow] = useState(false);

  const refreshOverflow = useCallback(() => {
    const row = document.getElementById(scrollTargetId);
    if (!row) {
      setShowArrow(false);
      return;
    }
    setShowArrow(row.scrollWidth > row.clientWidth + 2);
  }, [scrollTargetId]);

  useEffect(() => {
    const row = document.getElementById(scrollTargetId);
    if (!row) {
      queueMicrotask(() => refreshOverflow());
      return undefined;
    }

    const ro = new ResizeObserver(refreshOverflow);
    ro.observe(row);
    window.addEventListener("resize", refreshOverflow);
    row.addEventListener("scroll", refreshOverflow);

    const imgs = row.querySelectorAll("img");
    imgs.forEach((img) => img.addEventListener("load", refreshOverflow));

    const t = window.setTimeout(refreshOverflow, 400);
    queueMicrotask(refreshOverflow);

    return () => {
      window.clearTimeout(t);
      ro.disconnect();
      window.removeEventListener("resize", refreshOverflow);
      row.removeEventListener("scroll", refreshOverflow);
      imgs.forEach((img) => img.removeEventListener("load", refreshOverflow));
    };
  }, [refreshOverflow, scrollTargetId]);

  const handleClick = () => {
    const row = document.getElementById(scrollTargetId);
    if (!row) return;
    const step = Math.max(Math.floor(row.clientWidth * 0.72), 180);
    row.scrollBy({ left: step, behavior: "smooth" });
  };

  if (!showArrow) {
    return null;
  }

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
