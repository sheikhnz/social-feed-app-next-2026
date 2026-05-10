import Image from "next/image";
import Link from "next/link";

/* ─── Static data ─────────────────────────────────────────────────────────── */

const EXPLORE_ITEMS = [
  {
    label: "Learning",
    href: "#0",
    badge: "New",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
      >
        <circle
          cx="10"
          cy="10"
          r="7.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8.25 7.25 13.25 10 8.25 12.75z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Insights",
    href: "#0",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="24"
        fill="none"
        viewBox="0 0 22 24"
      >
        <path
          d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9 17V11M11 17V9M13 17V12M15 17V14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Find friends",
    href: "#0",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="24"
        fill="none"
        viewBox="0 0 22 24"
      >
        <circle
          cx="9"
          cy="8.5"
          r="3.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M3.5 21v-.5a5 5 0 015-5h1a5 5 0 015 5v.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M17.5 9v5M15 11.5h5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Bookmarks",
    href: "#0",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="24"
        fill="none"
        viewBox="0 0 22 24"
      >
        <path
          d="M8 2h6a2 2 0 012 2v17l-5-2.9L6 21V4a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Group",
    href: "#0",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="24"
        fill="none"
        viewBox="0 0 22 24"
      >
        <path
          d="M5 10a3 3 0 013-3h6a3 3 0 013 3v3a3 3 0 01-3 3H8a3 3 0 01-3-3v-3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8 12v3M6.5 13.5h3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="15"
          cy="12.5"
          r="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="17.5"
          cy="15"
          r="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "#0",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    label: "Save post",
    href: "#0",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
  },
];

const SUGGESTED_PEOPLE = [
  {
    id: 1,
    name: "Steve Jobs",
    role: "CEO of Apple",
    image: "/assets/images/people1.png",
  },
  {
    id: 2,
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    image: "/assets/images/people2.png",
  },
  {
    id: 3,
    name: "Dylan Field",
    role: "CEO of Figma",
    image: "/assets/images/people3.png",
  },
];

const EVENTS = [
  {
    id: 1,
    image: "/assets/images/feed_event1.png",
    day: "10",
    month: "Jul",
    title: "No more terrorism no more cry",
    going: "17 People Going",
  },
  {
    id: 2,
    image: "/assets/images/feed_event1.png",
    day: "10",
    month: "Jul",
    title: "No more terrorism no more cry",
    going: "17 People Going",
  },
];

/* ─── Component ───────────────────────────────────────────────────────────── */

/**
 * Left sidebar: Explore navigation, Suggested People, and Events sections.
 */
export const FeedLeftSidebar = () => (
  <div className="_feed_sidebar_col">
    {/* Explore */}
    <div className="_sidebar_card">
      <h4 className="_sidebar_card_title" style={{ marginBottom: 16 }}>
        Explore
      </h4>
      <ul className="_explore_list">
        {EXPLORE_ITEMS.map((item) => (
          <li key={item.label} className="_explore_item">
            <a href={item.href} className="_explore_link">
              <span style={{ display: "flex", flexShrink: 0 }}>
                {item.icon}
              </span>
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
        <a href="#0" className="_sidebar_see_all">
          See All
        </a>
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
              <Link href="#" className="_people_name">
                {person.name}
              </Link>
              <p className="_people_role">{person.role}</p>
            </div>
          </div>
          <a href="#0" className="_connect_btn">
            Connect
          </a>
        </div>
      ))}
    </div>

    {/* Events */}
    <div className="_sidebar_card">
      <div className="_sidebar_card_header">
        <h4 className="_sidebar_card_title">Events</h4>
        <a href="#" className="_sidebar_see_all">
          See all
        </a>
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
