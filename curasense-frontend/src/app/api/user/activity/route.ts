import { NextResponse } from "next/server";

// ============================================
// USER ACTIVITY - MVP MODE (Guest Only)
// ============================================
// Activity tracking disabled for MVP
// Database integration disabled for MVP

export async function GET() {
  return NextResponse.json({
    activities: [],
    total: 0,
    hasMore: false,
    message: "MVP Mode - Activity tracking available after full release",
    mode: "guest",
  });
}

export async function POST() {
  // MVP: Acknowledge but don't store
  return NextResponse.json({
    success: true,
    message: "MVP Mode - Activity logged locally only",
    mode: "guest",
  });
}

export async function DELETE() {
  // MVP: Nothing to delete
  return NextResponse.json({
    success: true,
    deletedCount: 0,
    message: "MVP Mode - No activity history stored",
    mode: "guest",
  });
}
