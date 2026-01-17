"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Trash2, Database } from "lucide-react";
import { AnalyticsDashboard } from "@/components/analytics";
import { Button } from "@/components/ui/button";
import { useDemoDataGenerator } from "@/lib/use-analytics-tracking";
import { useAppStore } from "@/lib/store";
import { springPresets } from "@/styles/tokens";
import { toast } from "sonner";

export default function AnalyticsPage() {
  const { generateDemoData, clearAllData } = useDemoDataGenerator();
  const reports = useAppStore((state) => state.reports);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDemo = async () => {
    setIsGenerating(true);
    try {
      generateDemoData(25);
      toast.success("Demo data generated successfully");
    } catch {
      toast.error("Failed to generate demo data");
    } finally {
      setTimeout(() => setIsGenerating(false), 500);
    }
  };

  const handleClearData = () => {
    clearAllData();
    toast.success("All data cleared");
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Demo Data Controls - Only show when no data or for dev purposes */}
      {reports.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springPresets.smooth}
          className="mb-8 p-6 rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[hsl(var(--brand-secondary)/0.1)]">
                <Database className="h-5 w-5 text-[hsl(var(--brand-secondary))]" />
              </div>
              <div>
                <h3 className="font-medium text-[hsl(var(--foreground))]">
                  No Analytics Data Yet
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Generate demo data to preview the analytics dashboard
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleGenerateDemo}
                disabled={isGenerating}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                Generate Demo Data
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Data Controls - Show when data exists */}
      {reports.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end gap-2 mb-4"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateDemo}
            disabled={isGenerating}
            className="gap-2"
          >
            <RefreshCw className={`h-3 w-3 ${isGenerating ? "animate-spin" : ""}`} />
            Add More Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearData}
            className="gap-2 text-[hsl(var(--color-error))] hover:text-[hsl(var(--color-error))]"
          >
            <Trash2 className="h-3 w-3" />
            Clear All
          </Button>
        </motion.div>
      )}

      <AnalyticsDashboard />
    </div>
  );
}
