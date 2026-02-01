import { NextRequest, NextResponse } from "next/server";

// ============================================
// USER PREFERENCES - MVP MODE (Guest Only)
// ============================================
// Returns default preferences for guest users
// Database integration disabled for MVP

const DEFAULT_PREFERENCES = {
  theme: "system",
  language: "en",
  notifications: {
    email: false,
    push: false,
    sms: false,
  },
  privacy: {
    anonymousMode: true,
    trackHistory: false,
    shareData: false,
  },
  display: {
    compactMode: false,
    showConfidence: true,
    highlightWarnings: true,
  },
};

export async function GET() {
  return NextResponse.json({
    preferences: DEFAULT_PREFERENCES,
    message: "MVP Mode - Preferences stored locally",
    mode: "guest",
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const updates = await request.json();
    
    // MVP: Just echo back the merged preferences
    // In guest mode, preferences should be stored in localStorage on client
    return NextResponse.json({
      preferences: { ...DEFAULT_PREFERENCES, ...updates },
      message: "MVP Mode - Save preferences to localStorage for persistence",
      mode: "guest",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
