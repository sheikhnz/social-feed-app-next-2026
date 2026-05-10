import type { ThemeConfig } from "antd";
import { theme } from "antd";

/** Brand primary; shared by Ant Design tokens and can be referenced from CSS if needed. */
export const APP_ANTD_COLOR_PRIMARY = "#2563eb";

type BuildAppAntdThemeParams = {
  isDark: boolean;
};

/**
 * Single source of truth for Ant Design theming: algorithms, global tokens, and common component defaults.
 */
export const buildAppAntdTheme = ({
  isDark,
}: BuildAppAntdThemeParams): ThemeConfig => ({
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: APP_ANTD_COLOR_PRIMARY,
    borderRadius: 8,
    fontFamily:
      "var(--font-geist-sans), var(--font-sans), system-ui, sans-serif",
  },
  components: {
    Button: {
      controlHeight: 40,
    },
    Layout: {
      bodyBg: isDark ? undefined : "transparent",
      headerBg: "transparent",
      footerBg: "transparent",
    },
  },
});
