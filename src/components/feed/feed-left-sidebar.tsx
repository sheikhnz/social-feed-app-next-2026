import Image from "next/image";
import Link from "next/link";

/* ─── Static data ─────────────────────────────────────────────────────────── */

const EXPLORE_ITEMS = [
  {
    label: "Learning",
    href: "#0",
    badge: "New",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path fill="#666" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm0 1.395a8.605 8.605 0 100 17.21 8.605 8.605 0 000-17.21zm-1.233 4.65l.104.01c.188.028.443.113.668.203 1.026.398 3.033 1.746 3.8 2.563l.223.239.08.092a1.16 1.16 0 01.025 1.405c-.04.053-.086.105-.19.215l-.269.28c-.812.794-2.57 1.971-3.569 2.391-.277.117-.675.25-.865.253a1.167 1.167 0 01-1.07-.629c-.053-.104-.12-.353-.171-.586l-.051-.262c-.093-.57-.143-1.437-.142-2.347l.001-.288c.01-.858.063-1.64.157-2.147.037-.207.12-.563.167-.678.104-.25.291-.45.523-.575a1.15 1.15 0 01.58-.14z" />
      </svg>
    ),
  },
  {
    label: "Insights",
    href: "#0",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
        <path fill="#666" d="M14.96 2c3.101 0 5.159 2.417 5.159 5.893v8.214c0 3.476-2.058 5.893-5.16 5.893H6.989c-3.101 0-5.159-2.417-5.159-5.893V7.893C1.83 4.42 3.892 2 6.988 2h7.972zm0 1.395H6.988c-2.37 0-3.883 1.774-3.883 4.498v8.214c0 2.727 1.507 4.498 3.883 4.498h7.972c2.375 0 3.883-1.77 3.883-4.498V7.893c0-2.727-1.508-4.498-3.883-4.498zM7.036 9.63c.323 0 .59.263.633.604l.005.094v6.382c0 .385-.285.697-.638.697-.323 0-.59-.262-.632-.603l-.006-.094v-6.382c0-.385.286-.697.638-.697zm3.97-3.053c.323 0 .59.262.632.603l.006.095v9.435c0 .385-.285.697-.638.697-.323 0-.59-.262-.632-.603l-.006-.094V7.274c0-.386.286-.698.638-.698zm3.905 6.426c.323 0 .59.262.632.603l.006.094v3.01c0 .385-.285.697-.638.697-.323 0-.59-.262-.632-.603l-.006-.094v-3.01c0-.385.286-.697.638-.697z" />
      </svg>
    ),
  },
  {
    label: "Find friends",
    href: "#0",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
        <path fill="#666" d="M9.032 14.456l.297.002c4.404.041 6.907 1.03 6.907 3.678 0 2.586-2.383 3.573-6.615 3.654l-.589.005c-4.588 0-7.203-.972-7.203-3.68 0-2.704 2.604-3.659 7.203-3.659zm8.53-8.037c.347 0 .634.282.679.648l.006.102v1.255h1.185c.38 0 .686.336.686.75 0 .38-.258.694-.593.743l-.093.007h-1.185v1.255c0 .414-.307.75-.686.75-.347 0-.634-.282-.68-.648l-.005-.102-.001-1.255h-1.183c-.379 0-.686-.336-.686-.75 0-.38.258-.694.593-.743l.093-.007h1.183V8.669c0-.414.308-.75.686-.75zM9.031 2c2.698 0 4.864 2.369 4.864 5.319 0 2.95-2.166 5.318-4.864 5.318-2.697 0-4.863-2.369-4.863-5.318C4.17 4.368 6.335 2 9.032 2z" />
      </svg>
    ),
  },
  {
    label: "Bookmarks",
    href: "#0",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
        <path fill="#666" d="M13.704 2c2.8 0 4.585 1.435 4.585 4.258V20.33c0 .443-.157.867-.436 1.18-.279.313-.658.489-1.063.489a1.456 1.456 0 01-.708-.203l-5.132-3.134-5.112 3.14c-.615.36-1.361.194-1.829-.405l-.09-.126-.085-.155a1.913 1.913 0 01-.176-.786V6.434C3.658 3.5 5.404 2 8.243 2h5.46zm.386 4.869c.357 0 .646.324.646.723 0 .367-.243.67-.559.718l-.087.006H7.81c-.357 0-.646-.324-.646-.723 0-.367.243-.67.558-.718l.088-.006h6.28z" />
      </svg>
    ),
  },
  {
    label: "Group",
    href: "#0",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Gaming",
    href: "#0",
    badge: "New",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
        <path fill="#666" d="M7.625 2c.315-.015.642.306.645.69.003.309.234.558.515.558h.928c1.317 0 2.402 1.169 2.419 2.616v.24h2.604c2.911-.026 5.255 2.337 5.377 5.414.005.12.006.245.004.368v4.31c.062 3.108-2.21 5.704-5.064 5.773-.117.003-.228 0-.34-.005a199.325 199.325 0 01-7.516 0c-2.816.132-5.238-2.292-5.363-5.411a6.262 6.262 0 01-.004-.371V11.87c-.03-1.497.48-2.931 1.438-4.024.956-1.094 2.245-1.714 3.629-1.746a3.28 3.28 0 01.342.005l3.617-.001v-.231c-.008-.676-.522-1.23-1.147-1.23h-.93c-.973 0-1.774-.866-1.785-1.937-.003-.386.28-.701.631-.705zm1.292 9.585c.341 0 .623.273.667.626l.007.098-.001 1.016h.946c.372 0 .673.325.673.725 0 .366-.253.669-.582.717l-.091.006h-.946v1.017c0 .4-.3.724-.673.724-.34 0-.622-.273-.667-.626l-.006-.098v-1.017h-.945c-.372 0-.674-.324-.674-.723 0-.367.254-.67.582-.718l.092-.006h.945v-1.017c0-.4.301-.724.673-.724zm7.058 3.428c.372 0 .674.324.674.724 0 .366-.254.67-.582.717l-.091.007h-.09c-.373 0-.674-.324-.674-.724 0-.367.253-.67.582-.717l.091-.007h.09zm-1.536-3.322c.372 0 .673.324.673.724 0 .367-.253.67-.582.718l-.091.006h-.09c-.372 0-.674-.324-.674-.724 0-.366.254-.67.582-.717l.092-.007h.09z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "#0",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    label: "Save post",
    href: "#0",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
  },
];

const SUGGESTED_PEOPLE = [
  { id: 1, name: "Steve Jobs", role: "CEO of Apple", image: "/assets/images/people1.png" },
  { id: 2, name: "Ryan Roslansky", role: "CEO of Linkedin", image: "/assets/images/people2.png" },
  { id: 3, name: "Dylan Field", role: "CEO of Figma", image: "/assets/images/people3.png" },
];

const EVENTS = [
  { id: 1, image: "/assets/images/feed_event1.png", day: "10", month: "Jul", title: "No more terrorism no more cry", going: "17 People Going" },
  { id: 2, image: "/assets/images/feed_event1.png", day: "10", month: "Jul", title: "No more terrorism no more cry", going: "17 People Going" },
];

/* ─── Component ───────────────────────────────────────────────────────────── */

/**
 * Left sidebar: Explore navigation, Suggested People, and Events sections.
 */
export const FeedLeftSidebar = () => (
  <div className="_feed_sidebar_col">
    {/* Explore */}
    <div className="_sidebar_card">
      <h4 className="_sidebar_card_title" style={{ marginBottom: 16 }}>Explore</h4>
      <ul className="_explore_list">
        {EXPLORE_ITEMS.map((item) => (
          <li key={item.label} className="_explore_item">
            <a href={item.href} className="_explore_link">
              <span style={{ display: "flex", flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className="_explore_new_badge">{item.badge}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* Suggested People */}
    <div className="_sidebar_card">
      <div className="_sidebar_card_header">
        <h4 className="_sidebar_card_title">Suggested People</h4>
        <a href="#0" className="_sidebar_see_all">See All</a>
      </div>
      {SUGGESTED_PEOPLE.map((person) => (
        <div key={person.id} className="_people_item">
          <div className="_people_info">
            <Image
              src={person.image}
              alt={person.name}
              width={40}
              height={40}
              className="_people_avatar"
            />
            <div>
              <Link href="#" className="_people_name">{person.name}</Link>
              <p className="_people_role">{person.role}</p>
            </div>
          </div>
          <a href="#0" className="_connect_btn">Connect</a>
        </div>
      ))}
    </div>

    {/* Events */}
    <div className="_sidebar_card">
      <div className="_sidebar_card_header">
        <h4 className="_sidebar_card_title">Events</h4>
        <a href="#" className="_sidebar_see_all">See all</a>
      </div>
      {EVENTS.map((event) => (
        <a key={event.id} href="#" className="_event_card">
          <div className="_event_img_wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.image} alt={event.title} />
          </div>
          <div className="_event_card_body">
            <div className="_event_date_box">
              <p className="_event_date_num">{event.day}</p>
              <p className="_event_date_month">{event.month}</p>
            </div>
            <div>
              <h4 className="_event_title">{event.title}</h4>
            </div>
          </div>
          <div className="_event_footer">
            <p className="_event_going_txt">{event.going}</p>
            <span className="_event_going_btn">Going</span>
          </div>
        </a>
      ))}
    </div>
  </div>
);
