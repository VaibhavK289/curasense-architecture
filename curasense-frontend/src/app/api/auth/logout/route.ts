import { NextResponse } from "next/server";

// MVP MODE: Auth disabled - guest only

export async function POST() {
  const response = NextResponse.json({
    message: "MVP Mode - Logged out (guest mode)",
    mode: "guest",
  });

  // Clear any cookies just in case
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
