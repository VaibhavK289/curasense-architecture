"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { springPresets } from "@/styles/tokens";

interface AccuracyMetricsProps {
  metrics: {
    averageConfidence: number;
    highConfidenceCount: number;
    mediumConfidenceCount: number;
    lowConfidenceCount: number;
  };
  className?: string;
}

export function AccuracyMetrics({ metrics, className }: AccuracyMetricsProps) {
  const totalWithConfidence =
    metrics.highConfidenceCount +
    metrics.mediumConfidenceCount +
    metrics.lowConfidenceCount;

  const highPercentage = totalWithConfidence > 0
    ? (metrics.highConfidenceCount / totalWithConfidence) * 100
    : 0;
  const mediumPercentage = totalWithConfidence > 0
    ? (metrics.mediumConfidenceCount / totalWithConfidence) * 100
    : 0;
  const lowPercentage = totalWithConfidence > 0
    ? (metrics.lowConfidenceCount / totalWithConfidence) * 100
    : 0;

  const confidenceLevel =
    metrics.averageConfidence >= 0.8
      ? { label: "Excellent", color: "text-[hsl(var(--color-success))]" }
      : metrics.averageConfidence >= 0.6
      ? { label: "Good", color: "text-[hsl(var(--brand-primary))]" }
      : metrics.averageConfidence >= 0.4
      ? { label: "Moderate", color: "text-[hsl(var(--color-warning))]" }
      : { label: "Needs Review", color: "text-[hsl(var(--color-error))]" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPresets.smooth}
      className={className}
    >
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[hsl(var(--brand-primary)/0.1)]">
            <Target className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
              Accuracy Metrics
            </h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              AI confidence scores distribution
            </p>
          </div>
        </div>

        {/* Average Confidence Score */}
        <div className="mb-6 p-4 rounded-lg bg-[hsl(var(--muted)/0.5)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
              Average Confidence
            </span>
            <span className={cn("font-semibold", confidenceLevel.color)}>
              {confidenceLevel.label}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.averageConfidence * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    metrics.averageConfidence >= 0.8
                      ? "bg-[hsl(var(--color-success))]"
                      : metrics.averageConfidence >= 0.6
                      ? "bg-[hsl(var(--brand-primary))]"
                      : metrics.averageConfidence >= 0.4
                      ? "bg-[hsl(var(--color-warning))]"
                      : "bg-[hsl(var(--color-error))]"
                  )}
                />
              </div>
            </div>
            <span className="text-2xl font-bold text-[hsl(var(--foreground))] min-w-[4rem] text-right">
              {(metrics.averageConfidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Confidence Distribution */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
            Confidence Distribution
          </h4>

          {/* High Confidence */}
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 text-[hsl(var(--color-success))]" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[hsl(var(--foreground))]">
                  High (&ge;80%)
                </span>
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {metrics.highConfidenceCount}
                </span>
              </div>
              <div className="h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${highPercentage}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="h-full bg-[hsl(var(--color-success))] rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Medium Confidence */}
          <div className="flex items-center gap-3">
            <TrendingUp className="h-4 w-4 text-[hsl(var(--color-warning))]" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[hsl(var(--foreground))]">
                  Medium (50-79%)
                </span>
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {metrics.mediumConfidenceCount}
                </span>
              </div>
              <div className="h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mediumPercentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-[hsl(var(--color-warning))] rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Low Confidence */}
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-[hsl(var(--color-error))]" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[hsl(var(--foreground))]">
                  Low (&lt;50%)
                </span>
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {metrics.lowConfidenceCount}
                </span>
              </div>
              <div className="h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${lowPercentage}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-[hsl(var(--color-error))] rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        {totalWithConfidence === 0 && (
          <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))] text-center">
            No confidence data available yet. Analyze some reports to see metrics.
          </p>
        )}
      </div>
    </motion.div>
  );
}
