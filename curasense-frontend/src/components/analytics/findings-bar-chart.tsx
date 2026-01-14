"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { springPresets } from "@/styles/tokens/animations";

interface FindingsBarChartProps {
  data: Record<string, number>;
  maxItems?: number;
  className?: string;
}

// Color gradient for bars
const COLORS = [
  "hsl(168, 84%, 40%)",  // brand-primary
  "hsl(168, 84%, 45%)",
  "hsl(168, 84%, 50%)",
  "hsl(168, 84%, 55%)",
  "hsl(168, 84%, 60%)",
  "hsl(168, 84%, 65%)",
  "hsl(168, 84%, 70%)",
  "hsl(168, 84%, 75%)",
];

export function FindingsBarChart({
  data,
  maxItems = 8,
  className,
}: FindingsBarChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxItems)
      .map(([finding, count]) => ({
        finding: finding.length > 25 ? finding.slice(0, 22) + "..." : finding,
        fullFinding: finding,
        count,
      }));
  }, [data, maxItems]);

  if (chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPresets.smooth}
        className={className}
      >
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">
            Most Common Findings
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-[hsl(var(--muted-foreground))]">
              No findings data available yet
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPresets.smooth}
      className={className}
    >
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            Most Common Findings
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Top {chartData.length} frequently identified conditions
          </p>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="finding"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value) => [`${value} occurrences`, "Count"]}
              />
              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
                animationDuration={800}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
