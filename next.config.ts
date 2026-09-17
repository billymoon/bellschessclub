import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  turbopack: {
    resolveAlias: process.env.NODE_ENV === "production" ? {
      mockdata: "./src/mockdata/empty.tsx"
    } : {
      "@sanity/client": "./src/mockdata/sanity-client.ts",
      mockdata: "./src/mockdata/localdev.tsx",
    },
  },
  webpack: (config, options) => {
    config.resolve.alias["mockdata"] =
      process.env.NODE_ENV === "production"
        ? path.resolve("./src/mockdata/empty.tsx")
        : path.resolve("./src/mockdata/localdev.tsx");
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
