"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Activity,
  Clock,
  TrendingUp,
  Zap,
  BarChart3,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { StatsCard } from "./stats-card";
import { UsageChart } from "./usage-chart";
import { ReportTypePieChart } from "./report-type-pie-chart";
import { FindingsBarChart } from "./findings-bar-chart";
import { AccuracyMetrics } from "./accuracy-metrics";
import { springPresets } from "@/styles/tokens";

interface AnalyticsDashboardProps {
  className?: string;
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const getAnalytics = useAppStore((state) => state.getAnalytics);
  const [isMounted, setIsMounted] = useState(false);
  
  // Ensure component only renders on client after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const analytics = useMemo(() => {
    if (!isMounted) {
      return {
        totalReportsAnalyzed: 0,
        reportsByType: {},
        reportsByStatus: {},
        averageProcessingTime: 0,
        findingsFrequency: {},
        dailyUsage: [],
        accuracyMetrics: {
          averageConfidence: 0,
          highConfidenceCount: 0,
          mediumConfidenceCount: 0,
          lowConfidenceCount: 0,
        },
        lastUpdated: new Date(),
      };
    }
    return getAnalytics();
  }, [getAnalytics, isMounted]);

  // Calculate week-over-week trend
  const weekTrend = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeek = analytics.dailyUsage.filter((d) => {
      const date = new Date(d.date);
      return date >= oneWeekAgo && date <= now;
    }).reduce((sum, d) => sum + d.count, 0);

    const lastWeek = analytics.dailyUsage.filter((d) => {
      const date = new Date(d.date);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    }).reduce((sum, d) => sum + d.count, 0);

    if (lastWeek === 0) return null;
    return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  }, [analytics.dailyUsage]);

  // Format processing time
  const formatProcessingTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className={className}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPresets.smooth}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[hsl(var(--brand-primary)/0.1)]">
            <BarChart3 className="h-6 w-6 text-[hsl(var(--brand-primary))]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--foreground))]">
            Analytics Dashboard
          </h1>
        </div>
        <p className="text-[hsl(var(--muted-foreground))]">
          Monitor your usage statistics and AI performance metrics
        </p>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Reports Analyzed"
          value={analytics.totalReportsAnalyzed}
          description="All-time completed analyses"
          icon={FileText}
          trend={weekTrend !== null ? { value: weekTrend, isPositive: weekTrend >= 0 } : undefined}
          color="brand"
        />
        <StatsCard
          title="Avg. Processing Time"
          value={formatProcessingTime(analytics.averageProcessingTime)}
          description="Average time per report"
          icon={Clock}
          color="info"
        />
        <StatsCard
          title="Unique Findings"
          value={Object.keys(analytics.findingsFrequency).length}
          description="Different conditions identified"
          icon={Activity}
          color="success"
        />
        <StatsCard
          title="AI Confidence"
          value={`${(analytics.accuracyMetrics.averageConfidence * 100).toFixed(0)}%`}
          description="Average confidence score"
          icon={analytics.accuracyMetrics.averageConfidence >= 0.7 ? TrendingUp : Zap}
          color={analytics.accuracyMetrics.averageConfidence >= 0.7 ? "success" : "warning"}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Usage Over Time - Full width on mobile, half on desktop */}
        <UsageChart data={analytics.dailyUsage} className="lg:col-span-2" />

        {/* Report Types Pie Chart */}
        <ReportTypePieChart data={analytics.reportsByType} />

        {/* Accuracy Metrics */}
        <AccuracyMetrics metrics={analytics.accuracyMetrics} />
      </div>

      {/* Most Common Findings - Full width */}
      <FindingsBarChart
        data={analytics.findingsFrequency}
        maxItems={10}
        className="mb-6"
      />

      {/* Last Updated */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-[hsl(var(--muted-foreground))] text-center"
      >
        Last updated: {analytics.lastUpdated.toLocaleString()}
      </motion.p>
    </div>
  );
}
