"use client";

import type { MouseEvent, ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { getUserName } from "@/lib/utils/user";
import {
  SearchOutlined,
  HomeOutlined,
  TeamOutlined,
  BellOutlined,
  MessageOutlined,
  MoreOutlined,
  DownOutlined,
  RightOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

/* ─── Static data (matches capital/feed.html notification panel) ───────────── */

const NOTIFICATION_OVERFLOW_LINKS = [
  "Mark as all read",
  "Notifivations seetings",
  "Open Notifications",
] as const;

type NotificationRow = {
  id: number;
  image: string;
  body: ReactNode;
  time: string;
};

const NOTIFICATION_ROWS: NotificationRow[] = [
  {
    id: 1,
    image: "/assets/images/friend-req.png",
    body: (
      <>
        <span className="_notify_txt_link">Steve Jobs</span>
        posted a link in your timeline.
      </>
    ),
    time: "42 miniutes ago",
  },
  {
    id: 2,
    image: "/assets/images/profile-1.png",
    body: (
      <>
        An admin changed the name of the group{" "}
        <span className="_notify_txt_link">Freelacer usa</span>
        to
        <span className="_notify_txt_link"> Freelacer usa </span>
      </>
    ),
    time: "42 miniutes ago",
  },
  ...[3, 4, 5, 6, 7, 8, 9, 10].map((id) =>
    id % 2 === 1
      ? {
          id,
          image: "/assets/images/friend-req.png",
          body: (
            <>
              <span className="_notify_txt_link">Steve Jobs</span>
              posted a link in your timeline.
            </>
          ),
          time: "42 miniutes ago",
        }
      : {
          id,
          image: "/assets/images/profile-1.png",
          body: (
            <>
              An admin changed the name of the group{" "}
              <span className="_notify_txt_link">Freelacer usa</span>
              to
              <span className="_notify_txt_link"> Freelacer usa </span>
            </>
          ),
          time: "42 miniutes ago",
        },
  ),
];

const PROFILE_DROP_ITEMS = [
  {
    label: "Settings",
    href: "#0",
    icon: <SettingOutlined style={{ fontSize: 18, color: "#377DFF" }} />,
  },
  {
    label: "Help & Support",
    href: "#0",
    icon: <QuestionCircleOutlined style={{ fontSize: 20, color: "#377DFF" }} />,
  },
  {
    label: "Log Out",
    href: "#0",
    icon: <LogoutOutlined style={{ fontSize: 19, color: "#377DFF" }} />,
  },
];

/* ─── Component ───────────────────────────────────────────────────────────── */

/**
 * Top navigation — structure and icons match capital feed.html / main.css `._header_nav`.
 */
export const FeedNavbar = () => {
  const { data: session } = useSession();
  const userName = getUserName(
    session?.user?.firstName,
    session?.user?.lastName,
    "User",
    session?.user?.name,
  );

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<"all" | "unread">("all");
  const [notifOverflowOpen, setNotifOverflowOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleNotif = useCallback(() => {
    setNotifOpen((prev) => {
      if (prev) {
        setNotifOverflowOpen(false);
      }
      return !prev;
    });
    setProfileOpen(false);
  }, []);

  const toggleNotifOverflow = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setNotifOverflowOpen((prev) => !prev);
    },
    [],
  );

  const toggleProfile = useCallback(() => {
    setProfileOpen((prev) => !prev);
    setNotifOpen(false);
    setNotifOverflowOpen(false);
  }, []);

  return (
    <nav className="_feed_navbar" aria-label="Main">
      <div className="_feed_nav_inner_container">
        <div className="_logo_wrap">
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/assets/images/logo.svg"
              alt="Buddy Script"
              width={169}
              height={32}
              className="_nav_logo_img"
              priority
            />
          </Link>
        </div>

        <div className="_nav_search_form">
          <span className="_nav_search_icon">
            <SearchOutlined style={{ fontSize: 17, color: "#666" }} />
          </span>
          <input
            className="_nav_search_input"
            type="search"
            placeholder="input search text"
            aria-label="Search"
          />
        </div>

        <div className="_feed_nav_flex_spacer" aria-hidden />

        <ul className="_feed_header_nav_list">
          <li className="_feed_header_nav_item">
            <Link
              href="/"
              className="_feed_header_nav_link _feed_header_nav_link_active"
              aria-current="page"
            >
              <HomeOutlined className="_home_active" style={{ fontSize: 20 }} />
            </Link>
          </li>

          <li className="_feed_header_nav_item">
            <Link href="#" className="_feed_header_nav_link">
              <TeamOutlined
                className="_header_nav_filled_glyph"
                style={{ fontSize: 22 }}
              />
            </Link>
          </li>

          <li className="_feed_header_nav_item">
            <div className="_feed_notify_wrap">
              <button
                type="button"
                className="_feed_header_nav_link"
                onClick={toggleNotif}
                aria-expanded={notifOpen}
                aria-label="Notifications"
              >
                <BellOutlined
                  className="_header_nav_filled_glyph"
                  style={{ fontSize: 20 }}
                />
                <span className="_counting">6</span>
              </button>
              <div
                className={`_notification_dropdown ${notifOpen ? "show" : ""}`}
                id="_notify_drop"
              >
                <div className="_notifications_content">
                  <h4 className="_notifications_content_title">
                    Notifications
                  </h4>
                  <div className="_notification_box_right">
                    <button
                      type="button"
                      className="_notification_box_right_link"
                      aria-expanded={notifOverflowOpen}
                      aria-label="Notification options"
                      onClick={toggleNotifOverflow}
                    >
                      <MoreOutlined
                        style={{
                          fontSize: 18,
                          color: "#C4C4C4",
                          transform: "rotate(90deg)",
                        }}
                      />
                    </button>
                    <div
                      className={`_notifications_drop_right ${notifOverflowOpen ? "show" : ""}`}
                    >
                      <ul className="_notification_list">
                        {NOTIFICATION_OVERFLOW_LINKS.map((label) => (
                          <li key={label} className="_notification_item">
                            <span className="_notification_link">{label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="_notifications_drop_box">
                  <div className="_notifications_drop_btn_grp">
                    <button
                      type="button"
                      className={
                        notifTab === "all"
                          ? "_notifications_btn_link"
                          : "_notifications_btn_link1"
                      }
                      onClick={() => setNotifTab("all")}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className={
                        notifTab === "unread"
                          ? "_notifications_btn_link"
                          : "_notifications_btn_link1"
                      }
                      onClick={() => setNotifTab("unread")}
                    >
                      Unread
                    </button>
                  </div>
                  <div className="_notifications_all">
                    {NOTIFICATION_ROWS.map((n) => (
                      <div key={n.id} className="_notification_box">
                        <div className="_notification_image">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={n.image} alt="" className="_notify_img" />
                        </div>
                        <div className="_notification_txt">
                          <p className="_notification_para">{n.body}</p>
                          <div className="_nitification_time">
                            <span>{n.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li className="_feed_header_nav_item">
            <Link href="#" className="_feed_header_nav_link">
              <MessageOutlined
                className="_header_nav_filled_glyph"
                style={{ fontSize: 20 }}
              />
              <span className="_counting">2</span>
            </Link>
          </li>
        </ul>

        <div className="_feed_header_nav_profile" ref={profileRef}>
          <button
            type="button"
            className="_feed_header_nav_profile_trigger"
            onClick={toggleProfile}
            aria-expanded={profileOpen}
            aria-label="Account menu"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <div className="_feed_header_nav_profile_image">
              <UserAvatar user={session?.user} size={24} />
            </div>
            <div
              className="_feed_header_nav_dropdown"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <p className="_feed_header_nav_para">{userName}</p>
              <DownOutlined style={{ fontSize: 10, color: "#112032" }} />
            </div>
          </button>

          <div className={`_profile_dropdown ${profileOpen ? "show" : ""}`}>
            <div className="_profile_drop_info">
              <UserAvatar
                user={session?.user}
                size={40}
                className="_profile_drop_avatar"
              />
              <div>
                <p className="_profile_drop_name">{userName}</p>
                <a href="#" className="_profile_drop_link">
                  View Profile
                </a>
              </div>
            </div>
            <div className="_profile_drop_divider" />
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {PROFILE_DROP_ITEMS.map((item) => (
                <li key={item.label}>
                  {item.label === "Log Out" ? (
                    <button
                      type="button"
                      className="_profile_drop_item"
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                      }}
                      onClick={() => signOut()}
                    >
                      <span className="_profile_drop_item_left">
                        <span style={{ display: "flex" }}>{item.icon}</span>
                        {item.label}
                      </span>
                      <RightOutlined
                        style={{ fontSize: 10, color: "#112032", opacity: 0.5 }}
                      />
                    </button>
                  ) : (
                    <a href={item.href} className="_profile_drop_item">
                      <span className="_profile_drop_item_left">
                        <span style={{ display: "flex" }}>{item.icon}</span>
                        {item.label}
                      </span>
                      <RightOutlined
                        style={{ fontSize: 10, color: "#112032", opacity: 0.5 }}
                      />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
