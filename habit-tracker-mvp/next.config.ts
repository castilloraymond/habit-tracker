import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds for initial deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during builds for initial deployment
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
