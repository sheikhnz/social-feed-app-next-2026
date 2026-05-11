import Image from "next/image";
import { StoryStripNextButton } from "@/components/feed/story-strip-next-button";
import { PlusOutlined } from "@ant-design/icons";

/* ─── Static data ─────────────────────────────────────────────────────────── */

const PUBLIC_STORIES = [
  {
    id: 1,
    name: "Ryan Roslansky",
    image: "/assets/images/card_ppl2.png",
    seen: false,
  },
  {
    id: 2,
    name: "Dylan Field",
    image: "/assets/images/card_ppl3.png",
    seen: true,
  },
  {
    id: 3,
    name: "Steve Jobs",
    image: "/assets/images/card_ppl4.png",
    seen: false,
  },
  {
    id: 4,
    name: "Sarah Chen",
    image: "/assets/images/people1.png",
    seen: true,
  },
  {
    id: 5,
    name: "Alex Rivera",
    image: "/assets/images/people2.png",
    seen: false,
  },
  {
    id: 6,
    name: "Jordan Lee",
    image: "/assets/images/people3.png",
    seen: false,
  },
  {
    id: 7,
    name: "Morgan Blake",
    image: "/assets/images/profile-1.png",
    seen: true,
  },
  {
    id: 8,
    name: "Casey Nguyen",
    image: "/assets/images/mobile_story_img1.png",
    seen: false,
  },
  {
    id: 9,
    name: "Taylor Brooks",
    image: "/assets/images/mobile_story_img2.png",
    seen: true,
  },
  {
    id: 10,
    name: "Riley Morgan",
    image: "/assets/images/photos1.png",
    seen: false,
  },
  {
    id: 11,
    name: "Jamie Fox",
    image: "/assets/images/photos2.png",
    seen: false,
  },
  {
    id: 12,
    name: "Quinn Adams",
    image: "/assets/images/photos3.png",
    seen: true,
  },
] as const;

/* ─── Component ───────────────────────────────────────────────────────────── */

/**
 * Story strip: desktop uses rectangular tiles; ≤992px uses circular avatars, rings, and horizontal scroll.
 */
export const StoryCards = () => (
  <div className="_stories_row _feed_inner_ppl_card">
    <div className="_story_scroll" id="story-scroll-row">
      {/* Your Story */}
      <div className="_story_card_my">
        <div className="_story_my_media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/card_ppl1.png" alt="Your story" />
          <div className="_story_add_btn_wrap">
            <button
              type="button"
              className="_story_add_btn"
              aria-label="Add story"
            >
              <PlusOutlined style={{ fontSize: 10, color: "#fff" }} />
            </button>
          </div>
        </div>
        <div className="_story_add_overlay">
          <p className="_story_add_label">Your Story</p>
        </div>
      </div>

      {/* Public stories */}
      {PUBLIC_STORIES.map((story) => (
        <div
          key={story.id}
          className={`_story_card_pub${story.seen ? " _story_ring_seen" : ""}`}
        >
          <div className="_story_pub_media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={story.image} alt={story.name} />
          </div>
          <p className="_story_pub_name">{story.name}</p>
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
