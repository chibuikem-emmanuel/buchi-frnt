import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,


  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: "https://your-django-backend.com/api/:path*/", // Your actual Django server URL
      },
      {
        source: "/api/:path*",
        destination: "https://your-django-backend.com/api/:path*",
      },
    ];
  },
  
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;