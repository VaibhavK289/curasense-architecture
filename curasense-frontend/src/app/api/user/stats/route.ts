import { NextResponse } from "next/server";

// ============================================
// USER STATS - MVP MODE (Guest Only)
// ============================================
// Returns mock stats for guest users
// Database integration disabled for MVP

export async function GET() {
  // MVP: Return mock stats for guest mode
  return NextResponse.json({
    stats: {
      totalReports: 0,
      prescriptionsAnalyzed: 0,
      xraysAnalyzed: 0,
      labReportsAnalyzed: 0,
      avgConfidenceScore: 0,
      avgProcessingTime: 0,
      reportsThisWeek: 0,
      reportsThisMonth: 0,
    },
    message: "MVP Mode - Stats tracking available after full release",
    mode: "guest",
  });
}
