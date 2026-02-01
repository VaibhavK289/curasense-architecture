import { NextRequest, NextResponse } from "next/server";

// MVP MODE: User profile stubbed - guest mode only

const GUEST_PROFILE = {
  id: "guest",
  email: "guest@curasense.app",
  firstName: "Guest",
  lastName: "User",
  displayName: "Guest User",
  role: "PATIENT",
  status: "ACTIVE",
  avatarUrl: null,
};

export async function GET() {
  return NextResponse.json({
    user: GUEST_PROFILE,
    message: "MVP Mode - Using guest profile",
    mode: "guest",
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // MVP: Echo back merged profile (not persisted)
    return NextResponse.json({
      message: "MVP Mode - Profile changes not persisted",
      user: { ...GUEST_PROFILE, ...body },
      mode: "guest",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
