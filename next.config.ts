import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ant-design/icons",
    "@ant-design/nextjs-registry",
    "antd",
  ],
  images: {
    remotePatterns: [
      // Google profile photos (OAuth)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // GitHub avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // Generic wildcard for any other CDN/OAuth provider
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
