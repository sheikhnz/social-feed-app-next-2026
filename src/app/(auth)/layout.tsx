import type { ReactNode } from "react";
import { AuthAntdLightZone } from "@/components/auth/auth-antd-light-zone";

/**
 * Auth route group layout — bare wrapper with no site header/footer.
 * Auth pages manage their own background and layout. Ant Design is forced to
 * the light theme here so form controls stay readable when OS prefers dark.
 */
export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthAntdLightZone>{children}</AuthAntdLightZone>;
}
