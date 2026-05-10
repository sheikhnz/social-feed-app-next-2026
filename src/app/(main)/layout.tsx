import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/app/actions/auth";
import { MainShell } from "@/components/layout/main-shell";

/**
 * Shared chrome for public and authenticated views (header, footer, content width).
 */
export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const headerNav = session?.user ? (
    <div className="flex items-center gap-3">
      <span className="hidden text-xs text-zinc-500 sm:inline dark:text-zinc-400">
        {session.user.email}
      </span>
      <form action={signOutAction}>
        <button
          className="rounded-md border border-black/15 px-2 py-1 text-xs font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          type="submit"
        >
          Sign out
        </button>
      </form>
    </div>
  ) : (
    <Link
      className="text-xs font-medium text-zinc-700 dark:text-zinc-200"
      href="#sign-in"
    >
      Sign in
    </Link>
  );

  return <MainShell headerNav={headerNav}>{children}</MainShell>;
}
