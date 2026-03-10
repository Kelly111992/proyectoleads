import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    serverComponentsExternalPackages: ['groq-sdk'],
  },
};

export default nextConfig;
