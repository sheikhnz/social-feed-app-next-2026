/**
 * Cloudinary delivery URL policy for posts (no secrets). Feed uses stored URLs as-is.
 */

const TRUSTED_IMAGE_UPLOAD_RE =
  /^https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/.+$/;

/** Blocks arbitrary URLs when saving posts — must be our cloud’s image upload delivery path. */
export const isTrustedCloudinaryImageUrl = ({
  urlString,
  trustedCloudName,
}: {
  readonly urlString: string;
  readonly trustedCloudName: string;
}): boolean => {
  const match = urlString.match(TRUSTED_IMAGE_UPLOAD_RE);
  return match?.[1] === trustedCloudName;
};
