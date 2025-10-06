"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/design-system";

interface LineTrendChartProps {
  data: any[];
  dataKeyX: string;
  series: {
    key: string;
    color: string;
  }[];
  height?: number;
  currency?: "USD" | "IDR";
  useNumber?: boolean;
}

// Custom Tooltip
const CustomTooltip = ({
  active,
  payload,
  label,
  currency = "IDR",
  useNumber = false,
}: TooltipProps<any, any> & { currency?: "USD" | "IDR"; useNumber?: boolean }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-text-primary mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-text-secondary">{entry.name}:</span>
            <span className="font-medium text-text-primary">
              {useNumber 
                ? formatNumber(Number(entry.value))
                : formatCurrency(Number(entry.value), currency, currency === "USD" ? "en-US" : "id-ID")
              }
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function LineTrendChart({
  data,
  dataKeyX,
  series,
  height = 260,
  currency = "IDR",
  useNumber = false,
}: LineTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#E5E7EB"
        />
        <XAxis
          dataKey={dataKeyX}
          fontSize={12}
          stroke="#6B7280"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          fontSize={12}
          stroke="#6B7280"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            useNumber 
              ? formatNumber(value)
              : formatCurrency(value, currency, currency === "USD" ? "en-US" : "id-ID")
          }
        />
        <Tooltip
          content={<CustomTooltip currency={currency} useNumber={useNumber} />}
          cursor={{ fill: "#F9FAFB" }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px" }}
          iconType="circle"
          iconSize={8}
        />
        {series.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
