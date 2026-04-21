import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  allowedDevOrigins: [
    "100.96.245.10",
    "127.0.0.1",
    "*.taildc86e0.ts.net",
    "donald-surface-book.taildc86e0.ts.net",
  ],
};

export default nextConfig;
