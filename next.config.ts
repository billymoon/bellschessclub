import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   nodeMiddleware: true,
  // },
  turbopack: {
    // ...
  },
  webpack: (config, options) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
      path: false,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;
