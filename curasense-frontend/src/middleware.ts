import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================
// CURASENSE MIDDLEWARE - MVP MODE
// ============================================
// Authentication disabled for MVP deployment
// All routes are public - users operate in guest mode
// This eliminates database dependency for core AI features
// ============================================

// Static assets and Next.js internals to skip
const skipPaths = [
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and Next.js internals
  if (skipPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // MVP Mode: All routes are public
  // Core AI features (prescription analysis, X-ray, labs) work without authentication
  // Users automatically operate in guest mode
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
