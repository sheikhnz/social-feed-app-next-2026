"use client";

import { App, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import { type ReactNode, useMemo } from "react";
import { usePrefersDark } from "@/hooks/use-prefers-dark";
import { buildAppAntdTheme } from "@/lib/antd/app-theme";

const APP_MESSAGE_MAX_COUNT = 3;
const APP_NOTIFICATION_MAX_COUNT = 3;

type AntdAppProviderProps = {
  children: ReactNode;
};

/**
 * Ant Design runtime: SSR-friendly style extraction is handled separately via `AntdRegistry` in `layout.tsx`.
 * This provider applies locale, tokens, dark/light algorithms, and the `App` shell for Modal/Message/notification hooks.
 */
export const AntdAppProvider = ({ children }: AntdAppProviderProps) => {
  const isDark = usePrefersDark();
  const theme = useMemo(() => buildAppAntdTheme({ isDark }), [isDark]);

  return (
    <ConfigProvider
      form={{ requiredMark: "optional", scrollToFirstError: true }}
      locale={enUS}
      theme={theme}
    >
      <App
        message={{ maxCount: APP_MESSAGE_MAX_COUNT }}
        notification={{
          placement: "topRight",
          maxCount: APP_NOTIFICATION_MAX_COUNT,
          stack: false,
        }}
      >
        {children}
      </App>
    </ConfigProvider>
  );
};
