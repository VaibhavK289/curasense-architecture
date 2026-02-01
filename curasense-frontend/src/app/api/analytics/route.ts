import { NextResponse } from "next/server";

// MVP MODE: Analytics stubbed - no database
export async function GET() {
  return NextResponse.json({
    stats: {
      totalReports: 0,
      byType: {},
      avgConfidence: 0,
      avgProcessingTime: 0,
    },
    dailyUsage: [],
    message: "MVP Mode - Analytics available after full release",
    mode: "guest",
  });
}
