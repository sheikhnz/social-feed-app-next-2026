/**
 * Skeleton placeholder for a PostCard while the feed is loading.
 * Matches the visual footprint of a real PostCard so layout doesn't shift.
 */
export const PostCardSkeleton = () => (
  <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
    <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
      {/* Author row */}
      <div className="_feed_inner_timeline_post_top" style={{ marginBottom: 16 }}>
        <div className="_feed_inner_timeline_post_box">
          <div className="_skeleton _skeleton_avatar" aria-hidden="true" />
          <div style={{ flex: 1, marginLeft: 12 }}>
            <div className="_skeleton _skeleton_line" style={{ width: "40%", marginBottom: 8 }} aria-hidden="true" />
            <div className="_skeleton _skeleton_line" style={{ width: "25%" }} aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Content lines */}
      <div className="_skeleton _skeleton_line" style={{ width: "100%", marginBottom: 8 }} aria-hidden="true" />
      <div className="_skeleton _skeleton_line" style={{ width: "80%", marginBottom: 8 }} aria-hidden="true" />
      <div className="_skeleton _skeleton_line" style={{ width: "60%", marginBottom: 16 }} aria-hidden="true" />

      {/* Image placeholder */}
      <div className="_skeleton _skeleton_img" aria-hidden="true" />
    </div>

    {/* Reaction bar */}
    <div
      className="_feed_inner_timeline_reaction"
      style={{ borderTop: "1px solid #f0f2f5", paddingTop: 12, marginTop: 12 }}
    >
      <div className="_skeleton _skeleton_line" style={{ width: 60, height: 28, borderRadius: 6 }} aria-hidden="true" />
      <div className="_skeleton _skeleton_line" style={{ width: 80, height: 28, borderRadius: 6 }} aria-hidden="true" />
      <div className="_skeleton _skeleton_line" style={{ width: 70, height: 28, borderRadius: 6 }} aria-hidden="true" />
    </div>
  </div>
);
