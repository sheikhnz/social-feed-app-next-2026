/**
 * Background decorative shape images used on both auth pages.
 * Positioned absolutely behind the content.
 */
export const AuthBackground = () => (
  <>
    <div className="_shape_one">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
    </div>
    <div className="_shape_two">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
    </div>
    <div className="_shape_three">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
    </div>
  </>
);
