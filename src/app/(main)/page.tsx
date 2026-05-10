import type { Metadata } from "next";
import { FeedLeftSidebar } from "@/components/feed/feed-left-sidebar";
import { FeedRightSidebar } from "@/components/feed/feed-right-sidebar";
import { StoryCards } from "@/components/feed/story-cards";
import { CreatePost } from "@/components/feed/create-post";
import { FeedTimeline } from "@/components/feed/feed-timeline";

export const metadata: Metadata = {
  title: "Feed",
  description: "Your social feed — posts, stories, and connections.",
};

/**
 * Main feed page — three-column layout matching the feed.html design:
 * left sidebar (explore/people/events), center (stories/post/timeline), right sidebar (friends).
 */
export default function FeedPage() {
  return (
    <div
      style={{
        maxWidth: 1320,
        margin: "0 auto",
        width: "100%",
        display: "flex",
        height: "calc(100vh - 65px)",
        overflow: "hidden",
      }}
    >
      <FeedLeftSidebar />

      {/* Middle column */}
      <div className="_feed_middle_col">
        <StoryCards />
        <CreatePost />
        <FeedTimeline />
      </div>

      <FeedRightSidebar />
    </div>
  );
}
