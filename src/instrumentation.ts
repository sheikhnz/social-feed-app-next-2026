/**
 * Next.js server bootstrap: preload optional SDKs that should not run in the browser bundle.
 */
export const register = (): void => {
  void import("@/services/cloudinary").then(
    ({ configureCloudinaryFromEnv }) => {
      configureCloudinaryFromEnv();
    },
  );
};
