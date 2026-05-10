import Image from "next/image";
import Link from "next/link";

/* ─── Static data ─────────────────────────────────────────────────────────── */

const MIGHT_LIKE = [
  {
    id: 1,
    name: "Radovan SkillArena",
    role: "Founder & CEO at Trophy",
    image: "/assets/images/Avatar.png",
  },
];

const FRIENDS = [
  {
    id: 1,
    name: "Steve Jobs",
    role: "CEO of Apple",
    image: "/assets/images/people1.png",
    online: false,
    lastSeen: "5 minute ago",
  },
  {
    id: 2,
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    image: "/assets/images/people2.png",
    online: true,
  },
  {
    id: 3,
    name: "Dylan Field",
    role: "CEO of Figma",
    image: "/assets/images/people3.png",
    online: true,
  },
  {
    id: 4,
    name: "Steve Jobs",
    role: "CEO of Apple",
    image: "/assets/images/people1.png",
    online: false,
    lastSeen: "5 minute ago",
  },
  {
    id: 5,
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    image: "/assets/images/people2.png",
    online: true,
  },
  {
    id: 6,
    name: "Dylan Field",
    role: "CEO of Figma",
    image: "/assets/images/people3.png",
    online: true,
  },
];

/* ─── Component ───────────────────────────────────────────────────────────── */

/**
 * Right sidebar: "You Might Like" suggestions and "Your Friends" contact list.
 */
export const FeedRightSidebar = () => (
  <div className="_feed_right_sidebar_col">
    {/* You Might Like */}
    <div className="_sidebar_card">
      <div className="_sidebar_card_header">
        <h4 className="_sidebar_card_title">You Might Like</h4>
        <a href="#0" className="_sidebar_see_all">
          See All
        </a>
      </div>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--bs-bg3)",
          margin: "0 0 16px",
        }}
      />
      {MIGHT_LIKE.map((person) => (
        <div key={person.id} className="_might_like_item">
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
          <div className="_might_like_actions">
            <button type="button" className="_ignore_btn">
              Ignore
            </button>
            <button type="button" className="_follow_btn">
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Your Friends */}
    <div className="_sidebar_card">
      <div className="_sidebar_card_header">
        <h4 className="_sidebar_card_title">Your Friends</h4>
        <a href="#" className="_sidebar_see_all">
          See All
        </a>
      </div>

      {/* Search */}
      <div className="_friends_search_wrap">
        <span className="_friends_search_icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 17 17"
          >
            <circle cx="7" cy="7" r="6" stroke="#666" />
            <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
          </svg>
        </span>
        <input
          type="search"
          className="_friends_search_input"
          placeholder="input search text"
          aria-label="Search friends"
        />
      </div>

      {/* Friends list */}
      <div>
        {FRIENDS.map((friend) => (
          <div
            key={friend.id}
            className={`_friend_item${!friend.online ? " _friend_item_inactive" : ""}`}
          >
            <div className="_friend_info">
              <Image
                src={friend.image}
                alt={friend.name}
                width={36}
                height={36}
                className="_friend_avatar"
              />
              <div>
                <Link href="#" className="_friend_name">
                  {friend.name}
                </Link>
                <p className="_friend_role">{friend.role}</p>
              </div>
            </div>
            <div>
              {friend.online ? (
                <div className="_online_dot" />
              ) : (
                <span className="_friend_status">{friend.lastSeen}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
