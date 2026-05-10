import type { ReactNode } from "react";

/**
 * Auth route group layout — bare wrapper with no site header/footer.
 * Auth pages manage their own background and layout.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
