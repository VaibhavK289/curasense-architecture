import { NextResponse } from "next/server";

/**
 * Health Check Endpoint - MVP Mode
 * 
 * Database checks disabled for MVP deployment.
 * Core AI features work without database connectivity.
 */
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    mode: "mvp",
    message: "CuraSense MVP - Database-free mode",
    services: {
      frontend: "operational",
      auth: "guest-mode-only",
      database: "disabled-for-mvp",
    },
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV,
  });
}
