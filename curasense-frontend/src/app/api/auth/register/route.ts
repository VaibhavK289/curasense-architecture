import { NextResponse } from "next/server";

// MVP MODE: Auth disabled - guest only

export async function POST() {
  return NextResponse.json({
    error: "MVP Mode - Registration disabled. Please use guest mode.",
    message: "Registration will be available in the full release.",
    mode: "guest",
  }, { status: 503 });
}
