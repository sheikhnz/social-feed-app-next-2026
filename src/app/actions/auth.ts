"use server";

import { signIn, signOut as authSignOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { registerSchema } from "@/lib/schemas/register";

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
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    repeatPassword: formData.get("repeatPassword"),
    terms: formData.get("terms") === "true",
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid registration data",
    };
  }

  const { firstName, lastName, email, password } = parsed.data;

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

    const signInFormData = new FormData();
    signInFormData.set("email", email);
    signInFormData.set("password", password);

    await signIn("credentials", signInFormData);
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
