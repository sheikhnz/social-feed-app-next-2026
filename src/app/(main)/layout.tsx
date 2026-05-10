import type { ReactNode } from "react";
import { FeedNavbar } from "@/components/feed/feed-navbar";

/**
 * Feed layout: fixed top navbar + scrollable 3-column content area.
 * Replaces the generic MainShell for the authenticated feed experience.
 */
export default function FeedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="_feed_main_layout bs-root">
      <FeedNavbar />
      {/* Matches feed.html: content sits below fixed ._header_nav via ._layout_inner_wrap padding-top */}
      <div className="_feed_layout_children">{children}</div>
    </div>
  );
}
