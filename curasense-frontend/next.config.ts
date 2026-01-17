import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel-optimized settings (remove standalone for serverless)
  // output: "standalone" is only for Docker deployments
  
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  
  // Vercel serverless function configuration
  // Maximize performance under free tier
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
