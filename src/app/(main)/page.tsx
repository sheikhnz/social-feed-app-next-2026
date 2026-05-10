import type { Metadata } from "next";
import { FeedLeftSidebar } from "@/components/feed/feed-left-sidebar";
import { FeedRightSidebar } from "@/components/feed/feed-right-sidebar";
import { StoryCards } from "@/components/feed/story-cards";
import { PostComposer } from "@/components/feed/create-post";
import { FeedList } from "@/components/feed/feed-timeline";

export const metadata: Metadata = {
  title: "Feed",
  description: "Your social feed — posts, stories, and connections.",
};

/**
 * Main feed page — three-column layout:
 * left sidebar (explore/people/events), center (stories/composer/timeline), right sidebar (friends).
 */
export default function FeedPage() {
  return (
    <div className="_feed_three_col">
      <FeedLeftSidebar />

      {/* Middle column */}
      <div className="_feed_middle_col">
        <StoryCards />
        <PostComposer />
        <FeedList />
      </div>

      <FeedRightSidebar />
    </div>
  );
}
