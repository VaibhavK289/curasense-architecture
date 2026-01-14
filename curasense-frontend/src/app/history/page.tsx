"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  ImageIcon, 
  Pill, 
  Calendar, 
  Clock, 
  Search, 
  Trash2, 
  Eye,
  Filter,
  SortAsc,
  SortDesc,
  FileX,
  ChevronRight,
} from "lucide-react";
import { useAppStore, Report } from "@/lib/store";
import { cn } from "@/lib/utils";
import { RevealOnScroll, StaggerReveal } from "@/components/motion";

type SortOrder = "newest" | "oldest";
type FilterType = "all" | "prescription" | "xray" | "medicine";

const typeConfig = {
  prescription: {
    icon: FileText,
    label: "Prescription",
    color: "text-[hsl(var(--color-diagnosis))]",
    bg: "bg-[hsl(var(--color-diagnosis)/0.1)]",
    border: "border-[hsl(var(--color-diagnosis)/0.2)]",
  },
  text: {
    icon: FileText,
    label: "Text Analysis",
    color: "text-[hsl(var(--color-diagnosis))]",
    bg: "bg-[hsl(var(--color-diagnosis)/0.1)]",
    border: "border-[hsl(var(--color-diagnosis)/0.2)]",
  },
  xray: {
    icon: ImageIcon,
    label: "X-Ray Analysis",
    color: "text-[hsl(var(--brand-secondary))]",
    bg: "bg-[hsl(var(--brand-secondary)/0.1)]",
    border: "border-[hsl(var(--brand-secondary)/0.2)]",
  },
  medicine: {
    icon: Pill,
    label: "Medicine Info",
    color: "text-[hsl(var(--color-medicine))]",
    bg: "bg-[hsl(var(--color-medicine)/0.1)]",
    border: "border-[hsl(var(--color-medicine)/0.2)]",
  },
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-6">
        <FileX className="w-10 h-10 text-[hsl(var(--muted-foreground))]" />
      </div>
      <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
        No Reports Yet
      </h3>
      <p className="text-[hsl(var(--muted-foreground))] max-w-md mb-6">
        Your diagnosis reports, X-ray analyses, and medicine lookups will appear here. 
        Start by analyzing a prescription or X-ray image.
      </p>
      <a
        href="/diagnosis/prescription"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[hsl(var(--brand-primary))] text-white font-medium hover:opacity-90 transition-opacity"
      >
        Get Started
        <ChevronRight className="w-4 h-4" />
      </a>
    </div>
  );
}

function ReportCard({ report, onView, onDelete }: { 
  report: Report; 
  onView: () => void;
  onDelete: () => void;
}) {
  const config = typeConfig[report.type];
  const Icon = config.icon;
  const date = new Date(report.createdAt);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative p-5 rounded-xl border transition-all duration-200",
        "bg-[hsl(var(--card))] hover:bg-[hsl(var(--card))]/80",
        "border-[hsl(var(--border))] hover:border-[hsl(var(--brand-primary)/0.3)]",
        "hover:shadow-lg hover:shadow-[hsl(var(--brand-primary)/0.05)]"
      )}
    >
      {/* Status indicator */}
      <div className={cn(
        "absolute top-4 right-4 w-2 h-2 rounded-full",
        report.status === "completed" && "bg-[hsl(var(--color-success))]",
        report.status === "pending" && "bg-[hsl(var(--color-warning))]",
        report.status === "error" && "bg-[hsl(var(--color-error))]"
      )} />

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          config.bg,
          config.border,
          "border"
        )}>
          <Icon className={cn("w-6 h-6", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[hsl(var(--foreground))] truncate">
            {report.title}
          </h3>
          <p className={cn("text-sm", config.color)}>
            {config.label}
          </p>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2 mb-4">
        {report.summary || "No summary available"}
      </p>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))] mb-4">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {date.toLocaleDateString("en-IN", { 
            day: "numeric",
            month: "short", 
            year: "numeric" 
          })}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {date.toLocaleTimeString("en-IN", { 
            hour: "numeric", 
            minute: "2-digit",
            hour12: true
          })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onView}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium",
            "bg-[hsl(var(--brand-primary))] text-white",
            "hover:opacity-90 transition-opacity"
          )}
        >
          <Eye className="w-4 h-4" />
          View Report
        </button>
        <button
          onClick={onDelete}
          className={cn(
            "p-2 rounded-lg",
            "bg-[hsl(var(--color-error)/0.1)] text-[hsl(var(--color-error))]",
            "hover:bg-[hsl(var(--color-error)/0.2)] transition-colors"
          )}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const { reports, removeReport, setCurrentReport } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const filteredAndSortedReports = useMemo(() => {
    let result = [...reports];

    // Filter by type
    if (filterType !== "all") {
      result = result.filter((r) => r.type === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.summary?.toLowerCase().includes(query) ||
          r.content.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [reports, filterType, searchQuery, sortOrder]);

  const handleViewReport = (report: Report) => {
    setCurrentReport(report);
    // Navigate to appropriate page based on type
    const routes: Record<string, string> = {
      prescription: "/diagnosis/prescription",
      xray: "/diagnosis/xray",
      medicine: "/medicine",
    };
    router.push(routes[report.type] || "/");
  };

  const handleDeleteReport = (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      removeReport(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <RevealOnScroll>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
            Report History
          </h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            View and manage your past diagnoses, X-ray analyses, and medicine lookups
          </p>
        </div>
      </RevealOnScroll>

      {/* Filters and Search */}
      <RevealOnScroll delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-lg",
                "bg-[hsl(var(--card))] border border-[hsl(var(--border))]",
                "text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]",
                "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-primary)/0.3)]",
                "transition-all"
              )}
            />
          </div>

          {/* Filter by Type */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className={cn(
                "px-4 py-2.5 rounded-lg",
                "bg-[hsl(var(--card))] border border-[hsl(var(--border))]",
                "text-[hsl(var(--foreground))]",
                "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-primary)/0.3)]"
              )}
            >
              <option value="all">All Types</option>
              <option value="prescription">Prescriptions</option>
              <option value="xray">X-Ray</option>
              <option value="medicine">Medicine</option>
            </select>
          </div>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg",
              "bg-[hsl(var(--card))] border border-[hsl(var(--border))]",
              "text-[hsl(var(--foreground))]",
              "hover:bg-[hsl(var(--muted))] transition-colors"
            )}
          >
            {sortOrder === "newest" ? (
              <>
                <SortDesc className="w-4 h-4" />
                Newest
              </>
            ) : (
              <>
                <SortAsc className="w-4 h-4" />
                Oldest
              </>
            )}
          </button>
        </div>
      </RevealOnScroll>

      {/* Stats */}
      {reports.length > 0 && (
        <RevealOnScroll delay={0.15}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Reports", value: reports.length, color: "brand-primary" },
              { label: "Prescriptions", value: reports.filter(r => r.type === "prescription").length, color: "color-diagnosis" },
              { label: "X-Ray Analyses", value: reports.filter(r => r.type === "xray").length, color: "brand-secondary" },
              { label: "Medicine Lookups", value: reports.filter(r => r.type === "medicine").length, color: "color-medicine" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]"
              >
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">
                  {stat.label}
                </p>
                <p className={cn(
                  "text-2xl font-bold",
                  `text-[hsl(var(--${stat.color}))]`
                )}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      )}

      {/* Report Grid */}
      {filteredAndSortedReports.length === 0 ? (
        <EmptyState />
      ) : (
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onView={() => handleViewReport(report)}
                onDelete={() => handleDeleteReport(report.id)}
              />
            ))}
          </AnimatePresence>
        </StaggerReveal>
      )}

      {/* Clear All Button */}
      {reports.length > 0 && (
        <RevealOnScroll delay={0.3}>
          <div className="mt-12 text-center">
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete all reports? This action cannot be undone.")) {
                  useAppStore.getState().clearReports();
                }
              }}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
                "bg-[hsl(var(--color-error)/0.1)] text-[hsl(var(--color-error))]",
                "hover:bg-[hsl(var(--color-error)/0.2)] transition-colors",
                "font-medium"
              )}
            >
              <Trash2 className="w-4 h-4" />
              Clear All History
            </button>
          </div>
        </RevealOnScroll>
      )}
    </div>
  );
}
