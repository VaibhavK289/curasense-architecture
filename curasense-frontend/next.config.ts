import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: "standalone",
  
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // Increase proxy timeout for long-running ML backend calls (10 minutes)
    proxyTimeout: 600000,
  },

  // Increase Node.js HTTP agent keep-alive timeout
  httpAgentOptions: {
    keepAlive: true,
  },

  // Increase server external timeout for API routes
  serverExternalPackages: [],
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
