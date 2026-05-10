import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type MainShellProps = {
  children: ReactNode;
  /** Optional header actions (links, auth controls). */
  headerNav?: ReactNode;
};

/**
 * Default application shell: header, centered main column, footer.
 */
export const MainShell = ({ children, headerNav }: MainShellProps) => (
  <div className="flex min-h-0 flex-1 flex-col">
    <SiteHeader nav={headerNav} />
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10">
      {children}
    </main>
    <SiteFooter />
  </div>
);
