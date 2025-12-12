import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  turbopack: {
    resolveAlias: {
      mockdata:
        process.env.NODE_ENV === "production"
          ? "./src/mockdata/empty.tsx"
          : "./src/mockdata/localdev.tsx",
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
