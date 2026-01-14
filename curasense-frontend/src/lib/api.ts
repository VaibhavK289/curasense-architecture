// API Configuration
// In production, these will point to deployed backends
const FRONTEND_API = process.env.NEXT_PUBLIC_FRONTEND_API || "http://localhost:8000";
const ML_API = process.env.NEXT_PUBLIC_ML_API || "http://localhost:8001";

// Request timeout (90 seconds for slow cold-start)
const REQUEST_TIMEOUT = 90000;

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

// PDF Diagnosis API
export async function diagnosePDF(file: File): Promise<DiagnosisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithTimeout(
    `${FRONTEND_API}/diagnose/pdf/`,
    {
      method: "POST",
      body: formData,
    },
    180000 // 3 min timeout for PDF processing
  );

  return response.json();
}

// Text Diagnosis API
export async function diagnoseText(text: string): Promise<DiagnosisResponse> {
  const response = await fetchWithTimeout(
    `${FRONTEND_API}/diagnose/text/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    },
    180000 // 3 min timeout for diagnosis
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

// Chat API
export async function sendChatMessage(
  message: string,
  reportContext?: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<ChatResponse> {
  const response = await fetchWithTimeout(`${FRONTEND_API}/api/chat`, {
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

// Medicine Comparison API
export async function compareMedicines(
  medicines: string[]
): Promise<{ comparison: Array<Record<string, string>> }> {
  const response = await fetchWithTimeout(`${FRONTEND_API}/api/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ medicines }),
  });

  return response.json();
}
