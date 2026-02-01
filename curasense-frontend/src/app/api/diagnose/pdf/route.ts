import { NextRequest, NextResponse } from "next/server";

// Backend URL - server-side only
// Uses BACKEND_API_URL from Vercel environment variables (Azure Container Apps)
const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000";

// Max duration for Vercel hobby plan (default is 10s, max is 60s on hobby, 300s on pro)
// Note: For PDF diagnosis, the actual ML processing happens on the external backend
// This route just proxies the request, so 60s should be enough
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Create AbortController with 60 second timeout (matches Vercel limit)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds
    
    // Forward the request to the backend with extended timeout
    const response = await fetch(`${BACKEND_URL}/diagnose/pdf/`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    // Get the response text first to handle non-JSON errors
    const responseText = await response.text();
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      // Backend returned non-JSON response (likely an error page or plain text)
      console.error("Backend returned non-JSON response:", responseText.substring(0, 500));
      return NextResponse.json(
        { 
          status: "error", 
          error: `Backend error: ${responseText.substring(0, 200)}`,
          debug: {
            backendUrl: BACKEND_URL,
            statusCode: response.status,
            statusText: response.statusText
          }
        },
        { status: 502 }
      );
    }

    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error proxying PDF diagnosis request:", error);
    return NextResponse.json(
      { 
        status: "error", 
        error: error instanceof Error ? error.message : "Failed to analyze PDF",
        debug: {
          backendUrl: BACKEND_URL
        }
      },
      { status: 500 }
    );
  }
}
