"use client";

import { ConfigProvider } from "antd";
import { type ReactNode, useMemo } from "react";
import { buildAppAntdTheme } from "@/lib/antd/app-theme";

type AuthAntdLightZoneProps = {
  children: ReactNode;
};

/**
 * Auth screens are designed as a fixed light UI. The root AntD provider follows
 * `prefers-color-scheme`; this nested provider restores the default (light)
 * algorithm so inputs and controls stay on the light palette.
 */
export const AuthAntdLightZone = ({
  children,
}: AuthAntdLightZoneProps) => {
  const lightTheme = useMemo(
    () => buildAppAntdTheme({ isDark: false }),
    [],
  );

  return (
    <ConfigProvider theme={lightTheme}>{children}</ConfigProvider>
  );
};
