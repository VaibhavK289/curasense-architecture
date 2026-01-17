import { NextRequest, NextResponse } from "next/server";

// Backend URL - server-side only (not NEXT_PUBLIC_)
const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_FRONTEND_API || "http://localhost:8000";

// Max duration for Vercel hobby plan (60s max)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Get the JSON body from the request
    const body = await request.json();
    
    // Create AbortController with 60 second timeout (matches Vercel limit)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds
    
    // Forward the request to the backend with extended timeout
    const response = await fetch(`${BACKEND_URL}/diagnose/text/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    // Get the response data
    const data = await response.json();

    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error proxying text diagnosis request:", error);
    return NextResponse.json(
      { 
        status: "error", 
        error: error instanceof Error ? error.message : "Failed to analyze text" 
      },
      { status: 500 }
    );
  }
}
