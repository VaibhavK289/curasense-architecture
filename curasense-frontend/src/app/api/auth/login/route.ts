import { NextResponse } from "next/server";

// MVP MODE: Auth disabled - guest only

export async function POST() {
  return NextResponse.json({
    error: "MVP Mode - Login disabled. Please use guest mode.",
    message: "Authentication will be available in the full release.",
    mode: "guest",
  }, { status: 503 });
}
