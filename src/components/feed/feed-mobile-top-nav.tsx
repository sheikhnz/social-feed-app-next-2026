import Image from "next/image";
import Link from "next/link";
import { SearchOutlined } from "@ant-design/icons";

const SEARCH_ARIA_LABEL = "Search";

/**
 * Mobile-only strip above the feed: brand logo (left) and search icon (right).
 * Hidden at desktop widths via `._feed_mobile_top_nav` in buddy.css.
 */
export const FeedMobileTopNav = () => (
  <header className="_feed_mobile_top_nav" aria-label="Buddy Script">
    <div className="_feed_mobile_top_nav_inner">
      <Link
        href="/"
        className="_feed_mobile_top_nav_logo"
        aria-label="Buddy Script home"
      >
        <Image
          src="/assets/images/logo.svg"
          alt=""
          width={169}
          height={32}
          className="_feed_mobile_top_nav_logo_img"
        />
      </Link>
      <Link
        href="#"
        className="_feed_mobile_top_nav_search_btn"
        aria-label={SEARCH_ARIA_LABEL}
        prefetch={false}
        scroll={false}
      >
        <SearchOutlined style={{ fontSize: 22, color: "rgb(0 0 0 / 0.65)" }} />
      </Link>
    </div>
  </header>
);
