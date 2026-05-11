import type { ReactNode } from "react";
import { FeedMobileTopNav } from "@/components/feed/feed-mobile-top-nav";
import { FeedNavbar } from "@/components/feed/feed-navbar";

/**
 * Feed layout: fixed top navbar + scrollable 3-column content area.
 * Replaces the generic MainShell for the authenticated feed experience.
 */
export default function FeedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="_feed_main_layout bs-root">
      <FeedMobileTopNav />
      <FeedNavbar />
      {/* Scroll area: desktop clears fixed top bar; ≤992px clears mobile top strip + bottom bar (buddy.css). */}
      <div className="_feed_layout_children">{children}</div>
    </div>
  );
}
