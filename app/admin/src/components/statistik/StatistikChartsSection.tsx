"use client";

import Image from "next/image";
import { useMemo, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

interface PartyData {
  id: string;
  nama: string;
  suara: number;
  persentase: number;
  color: string;
  logo?: string;
  position: number;
}

interface StatistikChartsSectionProps {
  data: PartyData[];
  view: string;
  loading: boolean;
}

interface RankingDatum extends PartyData {
  ranking: number;
  suaraLabel: string;
  percentageLabel: string;
}

interface ChartTooltipProps extends TooltipProps<number, string> {
  payload?: Array<{
    payload: RankingDatum;
  }>;
}

function ChartTooltip(props: ChartTooltipProps) {
  const { active, payload } = props;

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const datum = payload[0]?.payload;

  if (!datum) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 sm:px-4 sm:py-3 shadow-lg max-w-xs">
      <div className="flex items-center gap-2 sm:gap-3">
        {datum.logo ? (
          <div className="h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-lg border border-gray-100 bg-white flex-shrink-0">
            <Image
              src={datum.logo}
              alt={datum.nama}
              width={40}
              height={40}
              className="h-full w-full object-contain p-1 sm:p-1.5"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
            #{datum.ranking} {datum.nama}
          </p>
          <p className="text-xs text-gray-500">{datum.suaraLabel} suara</p>
        </div>
      </div>
      <div className="mt-2 sm:mt-3 flex justify-between text-xs text-gray-500">
        <span>Persentase</span>
        <span className="font-semibold text-gray-900">
          {datum.percentageLabel}
        </span>
      </div>
    </div>
  );
}

export function StatistikChartsSection({
  data,
  view,
  loading,
}: StatistikChartsSectionProps) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const updateWindowWidth = () => setWindowWidth(window.innerWidth);
    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-center sm:text-left">
            <div className="h-4 w-32 mx-auto sm:mx-0 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-6 w-48 sm:w-64 mx-auto sm:mx-0 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-5 w-24 mx-auto sm:mx-0 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
          {Array.from({ length: windowWidth < 768 ? 4 : 6 }).map((_, index) => (
            <div
              key={index}
              className="h-8 sm:h-10 w-full animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  const { chartData, totalVotes } = useMemo(() => {
    if (!data || data.length === 0) {
      return { chartData: [] as RankingDatum[], totalVotes: 0 };
    }

    const sorted = [...data].sort((a, b) => {
      if (a.position && b.position) {
        return a.position - b.position;
      }
      return b.suara - a.suara;
    });

    const total = sorted.reduce((sum, item) => sum + item.suara, 0);

    // Responsive limit - show fewer items on mobile
    const itemLimit = windowWidth < 768 ? 6 : 10;
    const limited = sorted.slice(0, itemLimit);

    return {
      totalVotes: total,
      chartData: limited.map((item, index) => ({
        ...item,
        ranking: index + 1,
        suaraLabel: item.suara.toLocaleString("id-ID"),
        percentageLabel: `${item.persentase.toFixed(1)}%`,
      })),
    };
  }, [data, windowWidth]);

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 text-center text-sm text-gray-500 shadow-sm">
        Data perolehan suara belum tersedia.
      </div>
    );
  }

  // Responsive chart height
  const baseHeight = windowWidth < 768 ? 40 : 56;
  const chartHeight = Math.max(280, chartData.length * baseHeight);
  const topPerformer = chartData[0];

  // Responsive settings
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 1024;
  
  const chartMargin = { 
    top: 4, 
    right: isMobile ? 20 : 48, 
    bottom: 4, 
    left: 0 
  };
  
  const yAxisWidth = isMobile ? 120 : isTablet ? 180 : 220;
  const fontSize = isMobile ? 10 : 12;
  const barRadius = isMobile ? 8 : 12;
  const maxBarSize = isMobile ? 24 : 32;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header - Stack on mobile, side by side on larger screens */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Perolehan Suara per {view === "partai" ? "Partai" : "Caleg"}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Ranking Perolehan Suara
            </h3>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Total Suara
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {totalVotes.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Chart Container - Responsive margins and dimensions */}
        <div className="w-full overflow-hidden">
          <div className="min-w-0">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart
                data={chartData}
                layout="vertical"
                barCategoryGap={12}
                margin={chartMargin}
              >
                <CartesianGrid 
                  horizontal={false} 
                  stroke="#E5E7EB" 
                  strokeDasharray="4 4" 
                />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize }}
                  tickFormatter={(value) => {
                    const num = Number(value);
                    if (isMobile && num >= 1000000) {
                      return `${(num / 1000000).toFixed(1)}M`;
                    } else if (isMobile && num >= 1000) {
                      return `${(num / 1000).toFixed(1)}K`;
                    }
                    return num.toLocaleString("id-ID");
                  }}
                />
                <YAxis
                  dataKey="nama"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={yAxisWidth}
                  tick={{ fontSize }}
                  tickFormatter={(value: string) => {
                    const item = chartData.find((entry) => entry.nama === value);
                    const maxLength = isMobile ? 12 : isTablet ? 20 : 30;
                    const truncated = value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
                    return item ? `#${item.ranking} ${truncated}` : truncated;
                  }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
                  content={<ChartTooltip />}
                />
                <Bar 
                  dataKey="suara" 
                  radius={[0, barRadius, barRadius, 0]} 
                  maxBarSize={maxBarSize}
                >
                  {chartData.map((item) => (
                    <Cell key={item.id} fill={item.color || "#3B82F6"} />
                  ))}
                  {!isMobile && (
                    <LabelList
                      dataKey="suaraLabel"
                      position="right"
                      offset={8}
                      fill="#111827"
                      fontSize={isTablet ? 10 : 12}
                    />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer - Responsive text and layout */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500">
          <span className="text-center sm:text-left">
            Menampilkan {chartData.length} entri teratas berdasarkan jumlah suara.
          </span>
          {topPerformer ? (
            <span className="font-semibold text-gray-700 text-center sm:text-right">
              <span className="hidden sm:inline">Pemimpin saat ini: </span>
              <span className="sm:hidden">Pemimpin: </span>
              #{topPerformer.ranking} {isMobile && topPerformer.nama.length > 15 
                ? `${topPerformer.nama.slice(0, 15)}...` 
                : topPerformer.nama}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
