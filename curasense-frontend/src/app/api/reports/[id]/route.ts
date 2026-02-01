import { NextResponse } from "next/server";

// MVP MODE: Individual report operations stubbed - no database

export async function GET() {
  return NextResponse.json({
    error: "MVP Mode - Report history not available",
    mode: "guest",
  }, { status: 404 });
}

export async function PATCH() {
  return NextResponse.json({
    message: "MVP Mode - Report updates not persisted",
    mode: "guest",
  });
}

export async function DELETE() {
  return NextResponse.json({
    message: "MVP Mode - No reports to delete",
    mode: "guest",
  });
}
