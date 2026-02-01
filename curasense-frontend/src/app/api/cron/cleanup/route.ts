import { NextResponse } from "next/server";

// MVP MODE: Cron job disabled - no database

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "MVP Mode - Cleanup job disabled (no database)",
    timestamp: new Date().toISOString(),
    mode: "guest",
  });
}
