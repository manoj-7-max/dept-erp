import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/student-assets/:path*',
        destination: '/student/:path*',
      },
    ];
  },
};

export default nextConfig;
