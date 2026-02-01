/**
 * ============================================
 * MVP MODE - DATABASE STUBBED
 * ============================================
 * This file has been stubbed for MVP deployment.
 * All database operations are no-ops.
 * Guest mode only - no persistent reports.
 */

// ============================================
// TYPES (kept for compatibility)
// ============================================

export type ReportType = "LAB_RESULT" | "IMAGING" | "PRESCRIPTION" | "CLINICAL_NOTE" | "OTHER";
export type ReportStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "ARCHIVED";
export type FileType = "PDF" | "IMAGE" | "DICOM" | "TEXT" | "OTHER";

export interface Report {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: ReportType;
  status: ReportStatus;
  originalFileName: string | null;
  fileType: FileType | null;
  fileSizeBytes: number | null;
  fileUrl: string | null;
  fileHash: string | null;
  summary: string | null;
  content: string | null;
  findings: string[];
  confidenceScore: number | null;
  processingTimeMs: number | null;
  aiModelVersion: string | null;
  errorMessage: string | null;
  errorCode: string | null;
  retryCount: number;
  processedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateReportInput {
  userId: string;
  title: string;
  description?: string;
  type: ReportType;
  originalFileName?: string;
  fileType?: FileType;
  fileSizeBytes?: number;
  fileUrl?: string;
  fileHash?: string;
}

export interface UpdateReportInput {
  title?: string;
  description?: string;
  summary?: string;
  content?: string;
  findings?: string[];
  confidenceScore?: number;
  processingTimeMs?: number;
  aiModelVersion?: string;
  status?: ReportStatus;
  errorMessage?: string;
  errorCode?: string;
}

export interface ReportFilters {
  userId?: string;
  type?: ReportType;
  status?: ReportStatus;
  fromDate?: Date;
  toDate?: Date;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ============================================
// STUBBED FUNCTIONS
// ============================================

export async function createReport(_input: CreateReportInput): Promise<Report> {
  console.log("[MVP] createReport called - stubbed");
  throw new Error("MVP mode: Report creation disabled - use demo mode");
}

export async function getReportById(
  _reportId: string,
  _userId?: string
): Promise<Report | null> {
  console.log("[MVP] getReportById called - stubbed");
  return null;
}

export async function getReportsByUser(
  _userId: string,
  _filters?: ReportFilters,
  pagination?: PaginationOptions
): Promise<PaginatedResult<Report>> {
  console.log("[MVP] getReportsByUser called - stubbed");
  return {
    data: [],
    pagination: {
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? 20,
      total: 0,
      totalPages: 0,
      hasMore: false,
    },
  };
}

export async function updateReport(
  _reportId: string,
  _userId: string,
  _input: UpdateReportInput
): Promise<Report> {
  console.log("[MVP] updateReport called - stubbed");
  throw new Error("MVP mode: Report updates disabled");
}

export async function markReportCompleted(
  _reportId: string,
  _userId: string,
  _result: {
    summary: string;
    content: string;
    findings: string[];
    confidenceScore: number;
    processingTimeMs: number;
    aiModelVersion?: string;
  }
): Promise<Report> {
  console.log("[MVP] markReportCompleted called - stubbed");
  throw new Error("MVP mode: Report updates disabled");
}

export async function markReportFailed(
  _reportId: string,
  _userId: string,
  _error: {
    message: string;
    code?: string;
  }
): Promise<Report> {
  console.log("[MVP] markReportFailed called - stubbed");
  throw new Error("MVP mode: Report updates disabled");
}

export async function deleteReport(
  _reportId: string,
  _userId: string,
  _hardDelete = false
): Promise<void> {
  console.log("[MVP] deleteReport called - stubbed");
}

export async function archiveReport(
  _reportId: string,
  _userId: string
): Promise<Report> {
  console.log("[MVP] archiveReport called - stubbed");
  throw new Error("MVP mode: Report archiving disabled");
}

// ============================================
// ANALYTICS QUERIES (stubbed)
// ============================================

export async function getReportStats(_userId: string) {
  console.log("[MVP] getReportStats called - stubbed");
  return {
    totalReports: 0,
    reportsByType: {},
    reportsByStatus: {},
    averageConfidence: 0,
    averageProcessingTime: 0,
    findingsFrequency: {},
  };
}

export async function getDailyUsage(_userId: string, days = 30) {
  console.log("[MVP] getDailyUsage called - stubbed");
  const result: Array<{ date: string; count: number }> = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    result.push({
      date: date.toISOString().split("T")[0],
      count: 0,
    });
  }
  
  return result;
}

// ============================================
// DEDUPLICATION (stubbed)
// ============================================

export async function findDuplicateReport(
  _userId: string,
  _fileHash: string
): Promise<Report | null> {
  console.log("[MVP] findDuplicateReport called - stubbed");
  return null;
}
