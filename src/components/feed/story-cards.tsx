import Image from "next/image";
import { StoryStripNextButton } from "@/components/feed/story-strip-next-button";

/* ─── Static data ─────────────────────────────────────────────────────────── */

const PUBLIC_STORIES = [
  { id: 1, name: "Ryan Roslansky", image: "/assets/images/card_ppl2.png" },
  { id: 2, name: "Dylan Field", image: "/assets/images/card_ppl3.png" },
  { id: 3, name: "Steve Jobs", image: "/assets/images/card_ppl4.png" },
];

/* ─── Component ───────────────────────────────────────────────────────────── */

/**
 * Story cards row — matches `capital/feed.html` `._feed_inner_ppl_card` + row of story tiles + `._feed_inner_story_arrow`.
 */
export const StoryCards = () => (
  <div className="_stories_row _feed_inner_ppl_card">
    <div className="_story_scroll" id="story-scroll-row">
      {/* Your Story */}
      <div className="_story_card_my">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/card_ppl1.png" alt="Your story" />
        <div className="_story_add_overlay">
          <div className="_story_add_btn_wrap">
            <button
              type="button"
              className="_story_add_btn"
              aria-label="Add story"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="none"
                viewBox="0 0 10 10"
              >
                <path
                  stroke="#fff"
                  strokeLinecap="round"
                  d="M.5 4.884h9M4.884 9.5v-9"
                />
              </svg>
            </button>
          </div>
          <p className="_story_add_label">Your Story</p>
        </div>
      </div>

      {/* Public stories */}
      {PUBLIC_STORIES.map((story) => (
        <div key={story.id} className="_story_card_pub">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={story.image} alt={story.name} />
          <div className="_story_pub_overlay">
            <p className="_story_pub_name">{story.name}</p>
          </div>
          <Image
            src="/assets/images/mini_pic.png"
            alt=""
            width={28}
            height={28}
            className="_story_mini_avatar"
          />
        </div>
      ))}
    </div>
    <StoryStripNextButton />
  </div>
);
