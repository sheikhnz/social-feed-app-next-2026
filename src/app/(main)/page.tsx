import type { Metadata } from "next";
import { auth } from "@/auth";
import { CredentialsSignInForm } from "@/components/forms/credentials-sign-in-form";

export const metadata: Metadata = {
  title: "Home",
  description: "Social feed home: session state, sign-in, and stack overview.",
};

/**
 * Home route: session summary and a reference implementation for RHF + Zod + Auth.js.
 */
export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-12">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Social Feed</h1>
        <p className="max-w-prose leading-relaxed text-zinc-600 dark:text-zinc-400">
          Stack is wired with Prisma, PostgreSQL, Auth.js (credentials + JWT
          sessions), TanStack Query, React Hook Form, Zod, bcrypt, Sonner
          toasts, and a Cloudinary service helper.
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {session?.user?.email ? (
            <>
              Signed in as{" "}
              <strong className="text-foreground">{session.user.email}</strong>.
            </>
          ) : (
            <>
              You are browsing as a guest. Sign in below after seeding the dev
              user.
            </>
          )}
        </p>
      </section>

      {!session?.user ? <CredentialsSignInForm /> : null}
    </div>
  );
}
