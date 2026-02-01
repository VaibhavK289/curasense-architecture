import { NextResponse } from "next/server";

// MVP MODE: Reports stubbed - no database persistence
// Reports are generated client-side and not stored

export async function GET() {
  return NextResponse.json({
    reports: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    message: "MVP Mode - Report history available after full release",
    mode: "guest",
  });
}

export async function POST() {
  return NextResponse.json({
    message: "MVP Mode - Reports generated but not persisted",
    mode: "guest",
    report: null,
  });
}
