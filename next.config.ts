import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // ビルド時の型チェックをスキップする
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;