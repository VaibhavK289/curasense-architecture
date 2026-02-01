import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();
  
  // Check if DATABASE_URL is configured (without exposing the actual value)
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  const databaseUrlPrefix = process.env.DATABASE_URL?.substring(0, 15) || "not set";

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: "connected",
          latency: `${dbLatency}ms`,
          configured: hasDatabaseUrl,
        },
      },
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    console.error("DATABASE_URL configured:", hasDatabaseUrl);
    console.error("DATABASE_URL prefix:", databaseUrlPrefix);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: "disconnected",
            error: error instanceof Error ? error.message : "Unknown error",
            configured: hasDatabaseUrl,
            urlPrefix: databaseUrlPrefix,
          },
        },
        environment: process.env.NODE_ENV,
      },
      { status: 503 }
    );
  }
}
