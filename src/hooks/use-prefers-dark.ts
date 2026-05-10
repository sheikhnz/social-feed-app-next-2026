import { useSyncExternalStore } from "react";

const PREFERS_DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

/**
 * Subscribes to OS light/dark preference for client-only theming (e.g. Ant Design algorithm).
 * Server snapshot defaults to light to match the initial HTML paint; the client reconciles after hydration.
 */
const subscribeToPrefersDark = (onStoreChange: () => void) => {
  const mediaQueryList = window.matchMedia(PREFERS_DARK_MEDIA_QUERY);
  mediaQueryList.addEventListener("change", onStoreChange);
  return () => mediaQueryList.removeEventListener("change", onStoreChange);
};

const getClientPrefersDark = (): boolean =>
  window.matchMedia(PREFERS_DARK_MEDIA_QUERY).matches;

const getServerPrefersDark = (): boolean => false;

export const usePrefersDark = (): boolean =>
  useSyncExternalStore(
    subscribeToPrefersDark,
    getClientPrefersDark,
    getServerPrefersDark,
  );
