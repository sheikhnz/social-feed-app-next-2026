"use server";

import { signIn, signOut as authSignOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";

/**
 * Server Action wrapper for Auth.js sign-out with a stable default redirect.
 */
export const signOutAction = async (): Promise<void> => {
  await authSignOut({ redirectTo: "/" });
};

export const loginAction = async (formData: FormData) => {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error; // Rethrow to allow Next.js redirect to work
  }
};

export const registerAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (!email || !password || !firstName || !lastName) {
    return { error: "Missing required fields" };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "User already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
      },
    });
    
    // Sign in after registration
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Failed to sign in after registration." };
    }
    throw error;
  }
};

export const signInWithGoogleAction = async () => {
  await signIn("google", { redirectTo: "/" });
};
