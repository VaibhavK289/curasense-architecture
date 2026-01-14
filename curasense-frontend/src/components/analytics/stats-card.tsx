"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { springPresets } from "@/styles/tokens/animations";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "brand" | "success" | "warning" | "error" | "info";
  className?: string;
}

const colorMap = {
  brand: {
    bg: "bg-[hsl(var(--brand-primary)/0.1)]",
    icon: "text-[hsl(var(--brand-primary))]",
    border: "border-[hsl(var(--brand-primary)/0.2)]",
  },
  success: {
    bg: "bg-[hsl(var(--color-success)/0.1)]",
    icon: "text-[hsl(var(--color-success))]",
    border: "border-[hsl(var(--color-success)/0.2)]",
  },
  warning: {
    bg: "bg-[hsl(var(--color-warning)/0.1)]",
    icon: "text-[hsl(var(--color-warning))]",
    border: "border-[hsl(var(--color-warning)/0.2)]",
  },
  error: {
    bg: "bg-[hsl(var(--color-error)/0.1)]",
    icon: "text-[hsl(var(--color-error))]",
    border: "border-[hsl(var(--color-error)/0.2)]",
  },
  info: {
    bg: "bg-[hsl(var(--color-info)/0.1)]",
    icon: "text-[hsl(var(--color-info))]",
    border: "border-[hsl(var(--color-info)/0.2)]",
  },
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "brand",
  className,
}: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPresets.smooth}
      whileHover={{ y: -2 }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-[hsl(var(--card))] p-6",
        colors.border,
        className
      )}
    >
      {/* Background gradient accent */}
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-20",
          colors.bg
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[hsl(var(--foreground))]">
              {value}
            </p>
            {trend && (
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive
                    ? "text-[hsl(var(--color-success))]"
                    : "text-[hsl(var(--color-error))]"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {description}
            </p>
          )}
        </div>

        <div className={cn("p-3 rounded-xl", colors.bg)}>
          <Icon className={cn("h-6 w-6", colors.icon)} />
        </div>
      </div>
    </motion.div>
  );
}
