"use client";

import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/design-system";

interface KPIStatProps {
  label: string;
  value: number | string;
  format?: {
    type: "currency" | "number" | "text";
    currency?: "USD" | "IDR";
    locale?: string;
  };
  icon?: LucideIcon;
  delta?: {
    value: number;
    direction: "up" | "down";
    tooltip?: string;
  };
  className?: string;
}

export function KPIStat({
  label,
  value,
  format = { type: "number" },
  icon: Icon,
  delta,
  className,
}: KPIStatProps) {
  // Format value based on type
  const formattedValue =
    typeof value === "number"
      ? format.type === "currency"
        ? formatCurrency(
            value,
            format.currency || "IDR",
            format.locale || "id-ID"
          )
        : format.type === "number"
        ? formatNumber(value, format.locale || "id-ID")
        : value.toString()
      : value;

  return (
    <div
      role="status"
      aria-label={`KPI ${label}`}
      className={cn(
        "rounded-xl bg-card shadow-sm p-5 border border-border",
        "hover:shadow-md transition-all duration-200",
        "flex flex-col gap-3",
        className
      )}
    >
      {/* Header with label and icon */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary font-medium">
          {label}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-primary" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end justify-between gap-2">
        <div className="text-num font-semibold text-text-primary">
          {formattedValue}
        </div>

        {/* Delta indicator */}
        {delta && (
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
              delta.direction === "up"
                ? "bg-brand-success/10 text-brand-success"
                : "bg-brand-danger/10 text-brand-danger"
            )}
            title={delta.tooltip}
          >
            {delta.direction === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(delta.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton loader for KPI
export function KPIStatSkeleton() {
  return (
    <div className="rounded-xl bg-card shadow-sm p-5 border border-border animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-24 bg-muted rounded"></div>
        <div className="w-10 h-10 bg-muted rounded-lg"></div>
      </div>
      <div className="h-8 w-32 bg-muted rounded"></div>
    </div>
  );
}
