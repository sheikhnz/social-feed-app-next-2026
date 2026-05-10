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
      {children}
    </div>
  );
}
