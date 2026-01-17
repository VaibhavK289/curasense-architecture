"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { springPresets } from "@/styles/tokens";

interface ReportTypePieChartProps {
  data: Record<string, number>;
  className?: string;
}

const COLORS = {
  prescription: "hsl(201, 96%, 32%)",  // color-diagnosis
  xray: "hsl(262, 83%, 58%)",          // color-imaging
  text: "hsl(168, 84%, 40%)",          // brand-primary
  medicine: "hsl(142, 76%, 36%)",      // color-success
};

const LABELS = {
  prescription: "Prescriptions",
  xray: "X-Ray/CT Scans",
  text: "Text Analysis",
  medicine: "Medicine Comparison",
};

export function ReportTypePieChart({ data, className }: ReportTypePieChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(data).map(([type, count]) => ({
      name: LABELS[type as keyof typeof LABELS] || type,
      value: count,
      type,
    }));
  }, [data]);

  const total = useMemo(() => {
    return Object.values(data).reduce((sum, count) => sum + count, 0);
  }, [data]);

  if (total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPresets.smooth}
        className={className}
      >
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">
            Reports by Type
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-[hsl(var(--muted-foreground))]">
              No data available yet
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
        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">
          Reports by Type
        </h3>

        <div className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                animationDuration={800}
                animationBegin={0}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.type}
                    fill={COLORS[entry.type as keyof typeof COLORS] || "hsl(var(--muted))"}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value) => [`${value} reports`, ""]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--foreground))", fontSize: "12px" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center mt-[-40px]">
            <p className="text-3xl font-bold text-[hsl(var(--foreground))]">{total}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Total</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
