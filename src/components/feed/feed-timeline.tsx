import { TimelinePost } from "@/components/feed/timeline-post";

/* ─── Static mock data (matches feed.html) ───────────────────────────────── */

const POSTS = [
  {
    id: 1,
    authorName: "Karim Saif",
    authorImage: "/assets/images/post_img.png",
    meta: "5 minute ago",
    title: "-Healthy Tracking App",
    image: "/assets/images/timeline_img.png",
    reactionImages: [
      "/assets/images/react_img1.png",
      "/assets/images/react_img2.png",
      "/assets/images/react_img3.png",
      "/assets/images/react_img4.png",
      "/assets/images/react_img5.png",
    ],
    reactionCount: "9+",
    commentCount: 12,
    shareCount: 122,
    comments: [
      {
        id: 1,
        authorName: "Radovan SkillArena",
        authorImage: "/assets/images/txt_img.png",
        text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        reactions: 198,
        time: "21m",
      },
    ],
  },
  {
    id: 2,
    authorName: "Karim Saif",
    authorImage: "/assets/images/post_img.png",
    meta: "5 minute ago",
    title: "-Healthy Tracking App",
    image: "/assets/images/timeline_img.png",
    reactionImages: [
      "/assets/images/react_img1.png",
      "/assets/images/react_img2.png",
      "/assets/images/react_img3.png",
      "/assets/images/react_img4.png",
      "/assets/images/react_img5.png",
    ],
    reactionCount: "9+",
    commentCount: 12,
    shareCount: 122,
    comments: [
      {
        id: 1,
        authorName: "Radovan SkillArena",
        authorImage: "/assets/images/txt_img.png",
        text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        reactions: 198,
        time: "21m",
      },
    ],
  },
];

/**
 * Timeline feed — list of post cards mapped from mock data.
 */
export const FeedTimeline = () => (
  <div>
    {POSTS.map((post) => (
      <TimelinePost key={post.id} post={post} />
    ))}
  </div>
);
