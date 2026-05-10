"use server";

import { signOut as authSignOut } from "@/auth";

/**
 * Server Action wrapper for Auth.js sign-out with a stable default redirect.
 */
export const signOutAction = async (): Promise<void> => {
  await authSignOut({ redirectTo: "/" });
};
