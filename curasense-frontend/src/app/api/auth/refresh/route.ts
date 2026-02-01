import { NextResponse } from "next/server";

// MVP MODE: Auth disabled - guest only

export async function POST() {
  return NextResponse.json({
    error: "MVP Mode - Token refresh disabled.",
    mode: "guest",
  }, { status: 401 });
}
