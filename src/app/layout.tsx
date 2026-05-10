import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { getServerEnv } from "@/lib/env";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const { siteUrl } = getServerEnv();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "Social Feed",
    template: "%s · Social Feed",
  },
  description: "Social feed application built with Next.js.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="text-foreground flex min-h-full flex-col bg-zinc-50 dark:bg-black">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
