"use client";

import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

export function KpiCards({
  summary,
}: {
  summary?: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
}) {
  const total = summary?.total ?? 0;
  const pending = summary?.pending ?? 0;
  const accepted = summary?.accepted ?? 0;
  const rejected = summary?.rejected ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary font-medium">
            Total Pendaftar
          </span>
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Users className="w-5 h-5 text-brand-primary" />
          </div>
        </div>
        <div className="text-num font-semibold text-text-primary">{total}</div>
      </div>

      <div className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary font-medium">
            Menunggu
          </span>
          <div className="w-10 h-10 rounded-lg bg-[#FF9C04]/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#FF9C04]" />
          </div>
        </div>
        <div className="text-num font-semibold text-[#FF9C04]">{pending}</div>
      </div>

      <div className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary font-medium">
            Diterima
          </span>
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <div className="text-num font-semibold text-green-600">{accepted}</div>
      </div>

      <div className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary font-medium">
            Ditolak
          </span>
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
        </div>
        <div className="text-num font-semibold text-red-600">{rejected}</div>
      </div>
    </div>
  );
}
