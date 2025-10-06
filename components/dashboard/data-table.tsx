"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/design-system";
import { Button } from "@/components/ui/button";

export interface DataTableColumn {
  key: string;
  label: string;
  width?: number;
  align?: "left" | "center" | "right";
  format?: "currency:USD" | "currency:IDR" | "number" | "text";
}

interface DataTableProps<T = any> {
  columns: DataTableColumn[];
  data: T[];
  rowKey: string;
  stickyHeader?: boolean;
  pagination?: {
    pageSize: number;
  };
  loading?: boolean;
  error?: string;
  emptyState?: {
    title: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  stickyHeader = true,
  pagination,
  loading = false,
  error,
  emptyState,
  className,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const pageSize = pagination?.pageSize || data.length;
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = pagination ? data.slice(startIndex, endIndex) : data;

  // Format cell value
  const formatCellValue = (value: any, format?: string) => {
    if (value === null || value === undefined) return "-";

    if (format === "currency:USD") {
      return formatCurrency(Number(value), "USD", "en-US");
    }
    if (format === "currency:IDR") {
      return formatCurrency(Number(value), "IDR", "id-ID");
    }
    if (format === "number") {
      return formatNumber(Number(value));
    }
    return String(value);
  };

  // Loading state
  if (loading) {
    return <DataTableSkeleton columns={columns.length} rows={pageSize} />;
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-xl bg-card shadow-sm border border-border p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-brand-danger/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-brand-danger" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Gagal memuat data
          </h3>
          <p className="text-sm text-text-secondary mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0 && emptyState) {
    return (
      <div className="rounded-xl bg-card shadow-sm border border-border p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-text-tertiary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {emptyState.title}
          </h3>
          {emptyState.action && (
            <Button
              variant="default"
              onClick={emptyState.action.onClick}
              className="bg-brand-primary hover:bg-brand-primary/90 mt-4"
            >
              {emptyState.action.label}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl bg-card shadow-sm border border-border overflow-hidden",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Data table">
          <thead
            className={cn(
              "bg-gray-200 border-b border-border",
              stickyHeader && "sticky top-0 z-10"
            )}
          >
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-sm font-bold text-[#001B55]",
                    column.align === "right" && "text-right",
                    column.align === "center" && "text-center",
                    column.align === "left" && "text-left",
                    !column.align && "text-left"
                  )}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={row[rowKey] || rowIndex}
                className="hover:bg-blue-100 transition-colors"
                style={{ backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#eff1f3' }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-sm text-text-secondary",
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center",
                      column.align === "left" && "text-left",
                      !column.align && "text-left"
                    )}
                  >
                    {formatCellValue(row[column.key], column.format)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="text-sm text-text-secondary">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, data.length)} dari{" "}
            {data.length} data
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-border"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-sm text-text-secondary">
              Halaman {currentPage} dari {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-border"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton loader for DataTable
export function DataTableSkeleton({
  columns = 5,
  rows = 8,
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
