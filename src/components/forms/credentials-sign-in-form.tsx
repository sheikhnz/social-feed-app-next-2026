"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  credentialsSignInSchema,
  type CredentialsSignInValues,
} from "@/lib/schemas/sign-in";

const SIGN_IN_ERROR_MESSAGE = "Invalid email or password";

/**
 * Example credentials form wiring React Hook Form, Zod, and Auth.js client sign-in.
 */
export const CredentialsSignInForm = () => {
  const form = useForm<CredentialsSignInValues>({
    resolver: zodResolver(credentialsSignInSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form
      className="flex max-w-sm flex-col gap-3 rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-zinc-950"
      id="sign-in"
      onSubmit={form.handleSubmit(async (data) => {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          callbackUrl: "/",
          redirect: false,
        });

        if (result?.error) {
          toast.error(SIGN_IN_ERROR_MESSAGE);
          return;
        }

        toast.success("Signed in");
        window.location.assign(result?.url ?? "/");
      })}
    >
      <h2 className="text-lg font-semibold tracking-tight">Sign in</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Use the dev user from{" "}
        <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">
          pnpm db:seed
        </code>{" "}
        once your database URL is set.
      </p>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Email</span>
        <input
          {...form.register("email")}
          autoComplete="email"
          className="rounded-lg border border-black/15 bg-white px-3 py-2 dark:border-white/20 dark:bg-zinc-950"
          type="email"
        />
        {form.formState.errors.email ? (
          <span className="text-xs text-red-600">
            {form.formState.errors.email.message}
          </span>
        ) : null}
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Password</span>
        <input
          {...form.register("password")}
          autoComplete="current-password"
          className="rounded-lg border border-black/15 bg-white px-3 py-2 dark:border-white/20 dark:bg-zinc-950"
          type="password"
        />
        {form.formState.errors.password ? (
          <span className="text-xs text-red-600">
            {form.formState.errors.password.message}
          </span>
        ) : null}
      </label>
      <button
        className="mt-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        disabled={form.formState.isSubmitting}
        type="submit"
      >
        {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
};
