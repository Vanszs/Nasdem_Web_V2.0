"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  legend?: boolean;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  legend = false,
  children,
  className,
}: ChartCardProps) {
  return (
    <div
      role="group"
      aria-label={`Chart ${title}`}
      className={cn(
        "rounded-xl bg-card shadow-sm p-5 border border-border",
        "hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {subtitle && (
          <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
        )}
      </div>

      {/* Chart Content */}
      <div className="w-full">{children}</div>
    </div>
  );
}

// Skeleton loader for ChartCard
export function ChartCardSkeleton() {
  return (
    <div className="rounded-xl bg-card shadow-sm p-5 border border-border">
      <div className="mb-4">
        <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="w-full h-64 bg-muted rounded animate-pulse"></div>
    </div>
  );
}
