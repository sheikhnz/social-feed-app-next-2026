"use client";

import { useCallback, useId, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCreatePost } from "@/hooks/feed/use-create-post";

const PLACEHOLDER_FLOAT = "\u00a0";
const LABEL_TEXT = "Write something ...";

/* ─── Icons ────────────────────────────────────────────────────────────────── */

const ICON_PHOTO = (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 20 20">
    <path fill="#666" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z" />
  </svg>
);

const ICON_VIDEO = (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={24} fill="none" viewBox="0 0 22 24">
    <path fill="#666" d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z" />
  </svg>
);

const ICON_EVENT = (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={24} fill="none" viewBox="0 0 22 24">
    <path fill="#666" d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698.32 0 .584.262.626.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.874a.632.632 0 00-.625-.603zm3.546 8.283H4.004l.001 6.621c0 2.325 1.137 3.616 3.183 3.697l.207.004h7.132c2.184 0 3.39-1.271 3.39-3.63v-6.692z" />
  </svg>
);

const ICON_ARTICLE = (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={20} fill="none" viewBox="0 0 18 20">
    <path fill="#666" d="M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056z" />
  </svg>
);

const ICON_POST_PLANE = (
  <svg className="_mar_img" xmlns="http://www.w3.org/2000/svg" width={14} height={13} fill="none" viewBox="0 0 14 13">
    <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z" clipRule="evenodd" />
  </svg>
);

const ATTACHMENT_BTNS = [
  { key: "photo", label: "Photo", className: "_feed_inner_text_area_bottom_photo", icon: ICON_PHOTO },
  { key: "video", label: "Video", className: "_feed_inner_text_area_bottom_video", icon: ICON_VIDEO },
  { key: "event", label: "Event", className: "_feed_inner_text_area_bottom_event", icon: ICON_EVENT },
  { key: "article", label: "Article", className: "_feed_inner_text_area_bottom_article", icon: ICON_ARTICLE },
] as const;

/* ─── Visibility selector ─────────────────────────────────────────────────── */

type Visibility = "PUBLIC" | "PRIVATE";

const VisibilityToggle = ({
  value,
  onChange,
}: {
  value: Visibility;
  onChange: (v: Visibility) => void;
}) => (
  <div className="_composer_visibility_toggle">
    <button
      type="button"
      className={`_composer_vis_btn${value === "PUBLIC" ? " _active" : ""}`}
      onClick={() => onChange("PUBLIC")}
      aria-pressed={value === "PUBLIC"}
    >
      🌐 Public
    </button>
    <button
      type="button"
      className={`_composer_vis_btn${value === "PRIVATE" ? " _active" : ""}`}
      onClick={() => onChange("PRIVATE")}
      aria-pressed={value === "PRIVATE"}
    >
      🔒 Private
    </button>
  </div>
);

/* ─── PostComposer ────────────────────────────────────────────────────────── */

/**
 * Create-post composer wired to the real API.
 * Optimistically inserts the post at the top of the feed on submit.
 */
export const PostComposer = () => {
  const reactId = useId();
  const fieldId = `feed-create-post-${reactId}`;
  const [text, setText] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const { data: session } = useSession();

  const createPost = useCreatePost({
    onSuccess: () => {
      setText("");
      toast.success("Post published!");
    },
  });

  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    const content = text.trim();
    if (!content || createPost.isPending) return;
    createPost.mutate({ content, visibility });
  }, [text, visibility, createPost]);

  const authorImage = session?.user?.image;
  const authorName = session?.user?.name ?? "You";

  return (
    <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
      <div className="_feed_inner_text_area_box">
        <div className="_feed_inner_text_area_box_image">
          {authorImage ? (
            <Image
              src={authorImage}
              alt={authorName}
              width={40}
              height={40}
              className="_txt_img"
            />
          ) : (
            <div className="_txt_img _post_avatar_fallback" aria-hidden="true">
              {authorName.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="form-floating _feed_inner_text_area_box_form">
          <textarea
            id={fieldId}
            className="form-control _textarea"
            placeholder={PLACEHOLDER_FLOAT}
            aria-label={LABEL_TEXT}
            rows={3}
            value={text}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={createPost.isPending}
          />
          <label className="_feed_textarea_label" htmlFor={fieldId}>
            {LABEL_TEXT}
          </label>
        </div>
      </div>

      <div className="_feed_inner_text_area_bottom">
        <div className="_feed_inner_text_area_item">
          {ATTACHMENT_BTNS.map(({ key, label, className, icon }) => (
            <div key={key} className={`${className} _feed_common`}>
              <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">{icon}</span>
                {label}
              </button>
            </div>
          ))}
        </div>

        <div className="_composer_controls_right">
          <VisibilityToggle value={visibility} onChange={setVisibility} />
          <div className="_feed_inner_text_area_btn">
            <button
              type="button"
              className="_feed_inner_text_area_btn_link"
              onClick={handleSubmit}
              disabled={!text.trim() || createPost.isPending}
              aria-label="Publish post"
            >
              {ICON_POST_PLANE}
              <span>{createPost.isPending ? "Posting…" : "Post"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile strip */}
      <div className="_feed_inner_text_area_bottom_mobile">
        <div className="_feed_inner_text_mobile">
          <div className="_feed_inner_text_area_item">
            {ATTACHMENT_BTNS.map(({ key, label, className, icon }) => (
              <div key={key} className={`${className} _feed_common`}>
                <button type="button" className="_feed_inner_text_area_bottom_photo_link" aria-label={label}>
                  <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">{icon}</span>
                </button>
              </div>
            ))}
          </div>
          <div className="_feed_inner_text_area_btn">
            <button
              type="button"
              className="_feed_inner_text_area_btn_link"
              onClick={handleSubmit}
              disabled={!text.trim() || createPost.isPending}
              aria-label="Publish post"
            >
              {ICON_POST_PLANE}
              <span>{createPost.isPending ? "…" : "Post"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep legacy named export for backward compatibility
export { PostComposer as CreatePost };
