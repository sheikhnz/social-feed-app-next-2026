import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ant-design/icons",
    "@ant-design/nextjs-registry",
    "antd",
  ],
};

export default nextConfig;
