import { NextRequest, NextResponse } from "next/server";

// Backend URL - server-side only (not NEXT_PUBLIC_)
const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_FRONTEND_API || "http://localhost:8000";

// Increase timeout to 10 minutes for ML model loading (Vercel only, standalone uses node timeout)
export const maxDuration = 600;

// Force Node.js runtime (not Edge) so we get full timeout control
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Create AbortController with 10 minute timeout for long-running ML pipeline
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes
    
    // Forward the request to the backend with extended timeout
    const response = await fetch(`${BACKEND_URL}/diagnose/pdf/`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    // Get the response data
    const data = await response.json();

    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error proxying PDF diagnosis request:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to analyze PDF";
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Analysis timed out. The ML pipeline is taking longer than expected. Please try again.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        status: "error", 
        error: errorMessage 
      },
      { status: error instanceof Error && error.name === "AbortError" ? 504 : 500 }
    );
  }
}
