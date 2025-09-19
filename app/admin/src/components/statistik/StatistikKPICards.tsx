"use client";

import { TrendingUp, TrendingDown, CheckCircle, ClipboardList, PieChart } from "lucide-react";

interface StatistikKPIData {
  totalSuaraSah: number;
  suaraTidakSah: number;
  tpsMasuk: number;
  totalTPS: number;
  partisipasi?: number;
  totalDPT?: number;
}

interface StatistikKPICardsProps {
  data: StatistikKPIData;
  loading: boolean;
}

export function StatistikKPICards({ data, loading }: StatistikKPICardsProps) {
  const cards = [
    {
      title: "Total Suara Sah",
      value: data.totalSuaraSah.toLocaleString("id-ID"),
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+2.3%",
      subtitle: "dari pemilu sebelumnya",
    },
    {
      title: "DPT (Daftar Pemilih Tetap)",
      value: data.totalDPT ? data.totalDPT.toLocaleString("id-ID") : "0",
      icon: ClipboardList,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      subtitle: "jumlah pemilih tetap",
    },
    {
      title: "TPS Masuk",
      value: `${data.tpsMasuk}/${data.totalTPS}`,
      progress: (data.tpsMasuk / data.totalTPS) * 100,
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      subtitle: "data masuk real-time",
    },
    {
      title: "Partisipasi Pemilih",
      value: `${data.partisipasi?.toFixed(1) || "0"}%`,
      icon: PieChart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+1.2%",
      subtitle: "tingkat partisipasi",
    },
    {
      title: "Suara Tidak Sah",
      value: data.suaraTidakSah.toLocaleString("id-ID"),
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "-0.5%",
      subtitle: "dari total suara",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-5">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              {card.change && (
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    card.change.startsWith("+")
                      ? "text-emerald-700 bg-emerald-100"
                      : "text-red-700 bg-red-100"
                  }`}
                >
                  {card.change}
                </span>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-2 leading-tight">{card.title}</p>
              <span className="text-2xl font-bold text-gray-900 leading-none">{card.value}</span>
            </div>

            {card.progress !== undefined && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                <div
                  className="h-2.5 rounded-full bg-blue-500 transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(card.progress, 100)}%` }}
                ></div>
              </div>
            )}

            <p className="text-xs text-gray-500 font-medium">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
