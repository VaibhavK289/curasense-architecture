/**
 * ============================================
 * MVP MODE - AUTH MIDDLEWARE STUBBED
 * ============================================
 * All routes are public in MVP mode.
 * No authentication checks performed.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * API Authentication Middleware (MVP - Passthrough)
 * 
 * In MVP mode, all requests are allowed through without authentication.
 */
export async function apiAuthMiddleware(_request: NextRequest) {
  // MVP Mode: Allow all requests through
  return NextResponse.next();
}

/**
 * Helper to extract user from middleware-injected headers
 * Returns guest user in MVP mode
 */
export function getUserFromHeaders(_headers: Headers) {
  return {
    userId: "guest",
    email: "guest@curasense.local",
    role: "PATIENT",
  };
}
