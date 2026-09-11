import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/coaches", destination: "/trainers", permanent: true },
      { source: "/coaches/:slug", destination: "/trainers/:slug", permanent: true },
      { source: "/membership", destination: "/memberships", permanent: true },
    ];
  },
};

export default nextConfig;
