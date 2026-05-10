import Link from "next/link";
import type { ReactNode } from "react";

const APP_NAME = "Social Feed";

/**
 * Top chrome: brand and primary navigation slots.
 */
export const SiteHeader = ({ nav }: { nav?: ReactNode }) => (
  <header className="border-b border-black/10 bg-white/80 backdrop-blur-md dark:border-white/15 dark:bg-black/70">
    <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
      <Link className="text-sm font-semibold tracking-tight" href="/">
        {APP_NAME}
      </Link>
      <nav className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
        {nav}
      </nav>
    </div>
  </header>
);
