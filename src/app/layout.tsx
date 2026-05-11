import type { Metadata, Viewport } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { AntdAppProvider } from "@/components/providers/antd-app-provider";
import { AppProviders } from "@/components/providers/app-providers";
import { getServerEnv } from "@/lib/env";
import "@/app/globals.css";
import "@/app/buddy.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const { siteUrl } = getServerEnv();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "Social Feed",
    template: "%s · Social Feed",
  },
  description: "Social feed application built with Next.js.",
  icons: {
    icon: "/assets/images/logo-copy.svg",
  },
};

/**
 * Root layout: fonts, global styles, and cross-cutting client providers.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="text-foreground flex min-h-full flex-col bg-zinc-50 dark:bg-black">
        <AntdRegistry>
          <AntdAppProvider>
            <AppProviders>{children}</AppProviders>
          </AntdAppProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
