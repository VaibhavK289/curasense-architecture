// API Configuration
// For X-Ray analysis, we still need direct access to the ML backend
// For PDF and text diagnosis, we use Next.js API routes as proxies to avoid CORS issues
const ML_API = process.env.NEXT_PUBLIC_ML_API || "http://localhost:8001";

// Request timeout (500 seconds for long-running operations)
const REQUEST_TIMEOUT = 500000;

// Helper function with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export interface DiagnosisResponse {
  status: "success" | "error";
  report?: string;
  error?: string;
}

export interface ChatResponse {
  response: string;
  model?: string;
}

// PDF Diagnosis API - Uses Next.js API route to proxy to backend
// This avoids CORS issues and keeps the same-origin request pattern
export async function diagnosePDF(file: File): Promise<DiagnosisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithTimeout(
    "/api/diagnose/pdf",
    {
      method: "POST",
      body: formData,
    },
    500000 // 8+ min timeout for PDF processing
  );

  return response.json();
}

// Text Diagnosis API - Uses Next.js API route to proxy to backend
export async function diagnoseText(text: string): Promise<DiagnosisResponse> {
  const response = await fetchWithTimeout(
    "/api/diagnose/text",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    },
    500000 // 8+ min timeout for diagnosis
  );

  return response.json();
}

// X-Ray Analysis API
export async function uploadXrayImage(
  threadId: string,
  file: File
): Promise<{ success: boolean; message?: string }> {
  const formData = new FormData();
  formData.append("thread_id", threadId);
  formData.append("image", file);

  const response = await fetchWithTimeout(`${ML_API}/input-image/`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return { success: response.ok, message: JSON.stringify(data) };
}

export async function queryXrayImage(
  threadId: string,
  query: string
): Promise<{ success: boolean }> {
  const response = await fetchWithTimeout(`${ML_API}/input-query/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ thread_id: threadId, query }),
  });

  return { success: response.ok };
}

export async function getXrayAnswer(threadId: string): Promise<string> {
  const response = await fetchWithTimeout(`${ML_API}/vision-answer/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ thread_id: threadId }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let result = "";

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
    }
  }

  return result;
}

// Chat API - Uses Next.js API route to proxy to backend
export async function sendChatMessage(
  message: string,
  reportContext?: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<ChatResponse> {
  const response = await fetchWithTimeout("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      report_context: reportContext || "",
      conversation_history: conversationHistory || [],
    }),
  });

  return response.json();
}

// Medicine Comparison API - Uses Next.js API route to proxy to backend
export async function compareMedicines(
  medicines: string[]
): Promise<{ comparison: Array<Record<string, string>> }> {
  const response = await fetchWithTimeout("/api/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ medicines }),
  });

  return response.json();
}
