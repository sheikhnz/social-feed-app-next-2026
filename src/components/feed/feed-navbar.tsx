"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─── Static data ─────────────────────────────────────────────────────────── */

const NOTIFICATIONS = [
  {
    id: 1,
    image: "/assets/images/friend-req.png",
    text: "Steve Jobs posted a link in your timeline.",
    linkText: "Steve Jobs",
    time: "42 minutes ago",
  },
  {
    id: 2,
    image: "/assets/images/profile-1.png",
    text: 'An admin changed the name of the group Freelacer usa to Freelacer usa.',
    linkText: "Freelacer usa",
    time: "42 minutes ago",
  },
  {
    id: 3,
    image: "/assets/images/friend-req.png",
    text: "Steve Jobs posted a link in your timeline.",
    linkText: "Steve Jobs",
    time: "42 minutes ago",
  },
  {
    id: 4,
    image: "/assets/images/profile-1.png",
    text: 'An admin changed the name of the group Freelacer usa.',
    linkText: "Freelacer usa",
    time: "42 minutes ago",
  },
];

const PROFILE_DROP_ITEMS = [
  {
    label: "Settings",
    href: "#0",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" fill="none" viewBox="0 0 18 19">
        <path fill="#377DFF" d="M9.584 0c.671 0 1.315.267 1.783.74.468.473.721 1.112.7 1.709l.009.14a.985.985 0 00.136.395c.145.242.382.418.659.488.276.071.57.03.849-.13l.155-.078c1.165-.538 2.563-.11 3.21.991l.58.99a.695.695 0 01.04.081l.055.107c.519 1.089.15 2.385-.838 3.043l-.244.15a1.046 1.046 0 00-.423 1.144c.074.272.255.504.53.66l.158.1c.478.328.823.812.973 1.367.17.626.08 1.292-.257 1.86l-.625 1.022-.094.144c-.735 1.038-2.16 1.355-3.248.738l-.129-.066a1.123 1.123 0 00-1.178.215c-.204.2-.317.471-.316.786l-.008.163C11.956 18.022 10.88 19 9.584 19h-1.17c-1.373 0-2.486-1.093-2.484-2.398l-.008-.14a.994.994 0 00-.14-.401 1.066 1.066 0 00-.652-.493 1.12 1.12 0 00-.852.127l-.169.083a2.526 2.526 0 01-1.698.122 2.47 2.47 0 01-1.488-1.154l-.604-1.024-.08-.152a2.404 2.404 0 01.975-3.132l.1-.061c.292-.199.467-.527.467-.877 0-.381-.207-.733-.569-.94l-.147-.092a2.419 2.419 0 01-.724-3.236l.615-.993a2.503 2.503 0 013.366-.912l.126.066c.13.058.269.089.403.09a1.08 1.08 0 001.086-1.068l.008-.185c.049-.57.301-1.106.713-1.513A2.5 2.5 0 018.414 0h1.17z" />
      </svg>
    ),
  },
  {
    label: "Help & Support",
    href: "#0",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19a9 9 0 100-18 9 9 0 000 18zM7.38 7.3a2.7 2.7 0 015.248.9c0 1.8-2.7 2.7-2.7 2.7M10 14.5h.009" />
      </svg>
    ),
  },
  {
    label: "Log Out",
    href: "#0",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
        <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667" />
      </svg>
    ),
  },
];

const CHEVRON_RIGHT_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10">
    <path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5" />
  </svg>
);

/* ─── Component ───────────────────────────────────────────────────────────── */

/**
 * Top navigation bar for the feed page.
 * Includes logo, search, nav icons (home, friends, notifications, chat), and profile dropdown.
 */
export const FeedNavbar = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLLIElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleNotif = useCallback(() => {
    setNotifOpen((prev) => !prev);
    setProfileOpen(false);
  }, []);

  const toggleProfile = useCallback(() => {
    setProfileOpen((prev) => !prev);
    setNotifOpen(false);
  }, []);

  return (
    <nav className="_feed_navbar">
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "0 8px",
        }}
      >
        {/* Logo */}
        <Link href="/feed" style={{ flexShrink: 0, textDecoration: "none" }}>
          <Image
            src="/assets/images/logo.svg"
            alt="Buddy Script"
            width={120}
            height={32}
            className="_nav_logo_img"
          />
        </Link>

        {/* Search */}
        <div className="_nav_search_form" style={{ marginLeft: 16 }}>
          <span className="_nav_search_icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
              <circle cx="7" cy="7" r="6" stroke="#666" />
              <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
            </svg>
          </span>
          <input
            className="_nav_search_input"
            type="search"
            placeholder="input search text"
            aria-label="Search"
          />
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Icon Nav */}
        <ul className="_nav_icon_list">
          {/* Home */}
          <li className="_nav_icon_item">
            <Link href="/feed" className="_nav_icon_link _nav_icon_link_active">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21">
                <path stroke="#000" strokeWidth="1.5" strokeOpacity=".6" d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" />
                <path stroke="#000" strokeOpacity=".6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857" />
              </svg>
            </Link>
          </li>

          {/* Friends */}
          <li className="_nav_icon_item">
            <Link href="#" className="_nav_icon_link">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="20" fill="none" viewBox="0 0 26 20">
                <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M12.79 12.15h.429c2.268.015 7.45.243 7.45 3.732 0 3.466-5.002 3.692-7.415 3.707h-.894c-2.268-.015-7.452-.243-7.452-3.727 0-3.47 5.184-3.697 7.452-3.711l.297-.001h.132zm0 1.75c-2.792 0-6.12.34-6.12 1.962 0 1.585 3.13 1.955 5.864 1.976l.255.002c2.792 0 6.118-.34 6.118-1.958 0-1.638-3.326-1.982-6.118-1.982zM12.789 0c2.96 0 5.368 2.392 5.368 5.33 0 2.94-2.407 5.331-5.368 5.331h-.031a5.329 5.329 0 01-3.782-1.57 5.253 5.253 0 01-1.553-3.764C7.423 2.392 9.83 0 12.789 0zm0 1.75c-1.987 0-3.604 1.607-3.604 3.58a3.526 3.526 0 001.04 2.527 3.58 3.58 0 002.535 1.054l.03.875v-.875c1.987 0 3.605-1.605 3.605-3.58S14.777 1.75 12.789 1.75z" clipRule="evenodd" />
              </svg>
            </Link>
          </li>

          {/* Notifications */}
          <li className="_nav_icon_item" ref={notifRef} style={{ position: "relative" }}>
            <button type="button" className="_nav_icon_link" onClick={toggleNotif} aria-label="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0z" clipRule="evenodd" />
              </svg>
              <span className="_nav_count_badge">6</span>
            </button>

            {/* Notification dropdown */}
            <div className={`_notification_dropdown${notifOpen ? " show" : ""}`} style={{ width: 360, right: -100 }}>
              <div className="_notif_header">
                <h4 className="_notif_title">Notifications</h4>
              </div>
              <div className="_notif_tabs">
                <button className="_notif_tab_btn _notif_tab_btn_active" type="button">All</button>
                <button className="_notif_tab_btn" type="button">Unread</button>
              </div>
              <div className="_notif_list">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="_notif_item">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={n.image} alt="" className="_notif_avatar" />
                    <div className="_notif_text">
                      <p className="_notif_para">{n.text}</p>
                      <span className="_notif_time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </li>

          {/* Chat */}
          <li className="_nav_icon_item" style={{ position: "relative" }}>
            <Link href="#" className="_nav_icon_link">
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" fill="none" viewBox="0 0 23 22">
                <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M11.43 0c2.96 0 5.743 1.143 7.833 3.22 4.32 4.29 4.32 11.271 0 15.562C17.145 20.886 14.293 22 11.405 22c-1.575 0-3.16-.33-4.643-1.012-.437-.174-.847-.338-1.14-.338-.338.002-.793.158-1.232.308-.9.307-2.022.69-2.852-.131-.826-.822-.445-1.932-.138-2.826.152-.44.307-.895.307-1.239 0-.282-.137-.642-.347-1.161C-.57 11.46.322 6.47 3.596 3.22A11.04 11.04 0 0111.43 0z" clipRule="evenodd" />
              </svg>
              <span className="_nav_count_badge">2</span>
            </Link>
          </li>
        </ul>

        {/* Profile */}
        <div ref={profileRef} style={{ position: "relative", marginLeft: 8 }}>
          <button type="button" className="_nav_profile_btn" onClick={toggleProfile}>
            <Image
              src="/assets/images/profile.png"
              alt="Dylan Field"
              width={36}
              height={36}
              className="_nav_profile_avatar"
            />
            <span className="_nav_profile_name">Dylan Field</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6">
              <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
            </svg>
          </button>

          {/* Profile dropdown */}
          <div className={`_profile_dropdown${profileOpen ? " show" : ""}`}>
            <div className="_profile_drop_info">
              <Image
                src="/assets/images/profile.png"
                alt="Dylan Field"
                width={40}
                height={40}
                className="_profile_drop_avatar"
              />
              <div>
                <p className="_profile_drop_name">Dylan Field</p>
                <a href="#" className="_profile_drop_link">View Profile</a>
              </div>
            </div>
            <div className="_profile_drop_divider" />
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {PROFILE_DROP_ITEMS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="_profile_drop_item">
                    <span className="_profile_drop_item_left">
                      <span style={{ display: "flex" }}>{item.icon}</span>
                      {item.label}
                    </span>
                    {CHEVRON_RIGHT_SVG}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
