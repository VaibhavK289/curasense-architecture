import { NextResponse } from "next/server";

// MVP MODE: Auth disabled - guest only

export async function GET() {
  return NextResponse.json({
    error: "MVP Mode - Token verification disabled.",
    mode: "guest",
  }, { status: 401 });
}
