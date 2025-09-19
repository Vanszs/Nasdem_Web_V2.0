"use client";

import Image from "next/image";
import { useMemo } from "react";
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
  view: "partai" | "caleg";
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
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
      <div className="flex items-center gap-3">
        {datum.logo ? (
          <div className="h-10 w-10 overflow-hidden rounded-lg border border-gray-100 bg-white">
            <Image
              src={datum.logo}
              alt={datum.nama}
              width={40}
              height={40}
              className="h-full w-full object-contain p-1.5"
            />
          </div>
        ) : null}
        <div>
          <p className="text-sm font-semibold text-gray-900">
            #{datum.ranking} {datum.nama}
          </p>
          <p className="text-xs text-gray-500">{datum.suaraLabel} suara</p>
        </div>
      </div>
      <div className="mt-3 flex justify-between text-xs text-gray-500">
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
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-6 w-64 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-full animate-pulse rounded-xl bg-gray-100"
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

    const limited = sorted.slice(0, 10);

    return {
      totalVotes: total,
      chartData: limited.map((item, index) => ({
        ...item,
        ranking: index + 1,
        suaraLabel: item.suara.toLocaleString("id-ID"),
        percentageLabel: `${item.persentase.toFixed(1)}%`,
      })),
    };
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
        Data perolehan suara belum tersedia.
      </div>
    );
  }

  const chartHeight = Math.max(320, chartData.length * 56);
  const topPerformer = chartData[0];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Perolehan Suara per {view === "partai" ? "Partai" : "Caleg"}
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              Ranking Perolehan Suara
            </h3>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Total Suara
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {totalVotes.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="w-full">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={chartData}
              layout="vertical"
              barCategoryGap={18}
              margin={{ top: 4, right: 48, bottom: 4, left: 0 }}
            >
              <CartesianGrid horizontal={false} stroke="#E5E7EB" strokeDasharray="4 4" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  Number(value).toLocaleString("id-ID")
                }
              />
              <YAxis
                dataKey="nama"
                type="category"
                tickLine={false}
                axisLine={false}
                width={220}
                tickFormatter={(value: string) => {
                  const item = chartData.find((entry) => entry.nama === value);
                  return item ? `#${item.ranking} ${value}` : value;
                }}
              />
              <Tooltip
                cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
                content={<ChartTooltip />}
              />
              <Bar dataKey="suara" radius={[0, 12, 12, 0]} maxBarSize={32}>
                {chartData.map((item) => (
                  <Cell key={item.id} fill={item.color || "#3B82F6"} />
                ))}
                <LabelList
                  dataKey="suaraLabel"
                  position="right"
                  offset={12}
                  fill="#111827"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
          <span>
            Menampilkan {chartData.length} entri teratas berdasarkan jumlah suara.
          </span>
          {topPerformer ? (
            <span className="font-semibold text-gray-700">
              Pemimpin saat ini: #{topPerformer.ranking} {topPerformer.nama}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
