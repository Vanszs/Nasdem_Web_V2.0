"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  Cell,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/design-system";

interface StackedBarChartProps {
  data: any[];
  dataKeyX: string;
  stacks: {
    key: string;
    color: string;
  }[];
  height?: number;
  currency?: "USD" | "IDR";
  useNumber?: boolean; // Option to use number format instead of currency
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
              className="w-3 h-3 rounded-sm"
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

export function StackedBarChart({
  data,
  dataKeyX,
  stacks,
  height = 260,
  currency = "IDR",
  useNumber = false,
}: StackedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        barCategoryGap="20%"
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
        {stacks.map((stack, index) => {
          // Hanya bar pertama yang dapat rounded di bawah
          // Hanya bar terakhir yang dapat rounded di atas
          const isFirst = index === 0;
          const isLast = index === stacks.length - 1;
          
          let radius: [number, number, number, number] = [0, 0, 0, 0];
          
          if (isLast) {
            // Bar paling atas: radius di ujung atas
            radius = [8, 8, 0, 0];
          } else if (isFirst) {
            // Bar paling bawah: radius di ujung bawah
            radius = [0, 0, 8, 8];
          }
          
          return (
            <Bar
              key={stack.key}
              dataKey={stack.key}
              stackId="a"
              fill={stack.color}
              radius={radius}
              maxBarSize={40}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
