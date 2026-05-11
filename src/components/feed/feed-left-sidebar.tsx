import Image from "next/image";
import Link from "next/link";
import {
  PlayCircleOutlined,
  BarChartOutlined,
  UserAddOutlined,
  BookOutlined,
  TeamOutlined,
  TrophyOutlined,
  SettingOutlined,
  SaveOutlined,
} from "@ant-design/icons";

/* ─── Static data ─────────────────────────────────────────────────────────── */

const EXPLORE_ITEMS = [
  {
    label: "Learning",
    href: "#0",
    badge: "New",
    icon: <PlayCircleOutlined style={{ fontSize: 20 }} />,
  },
  {
    label: "Insights",
    href: "#0",
    icon: <BarChartOutlined style={{ fontSize: 20 }} />,
  },
  {
    label: "Find friends",
    href: "#0",
    icon: <UserAddOutlined style={{ fontSize: 20 }} />,
  },
  {
    label: "Bookmarks",
    href: "#0",
    icon: <BookOutlined style={{ fontSize: 20 }} />,
  },
  {
    label: "Group",
    href: "#0",
    icon: <TeamOutlined style={{ fontSize: 20 }} />,
  },
  {
    label: "Gaming",
    href: "#0",
    badge: "New",
    icon: <TrophyOutlined style={{ fontSize: 20 }} />,
  },
  {
    label: "Settings",
    href: "#0",
    icon: <SettingOutlined style={{ fontSize: 20 }} />,
  },
  {
    label: "Save post",
    href: "#0",
    icon: <SaveOutlined style={{ fontSize: 20 }} />,
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
