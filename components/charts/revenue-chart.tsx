"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
  data: { month: string; revenue: number; orders: number }[];
  title?: string;
}

export function RevenueChart({ data, title = "Revenue over time" }: RevenueChartProps) {
  return (
    <div className="bg-amazon-navy-mid rounded-xl border border-amazon-navy-light p-6">
      <h3 className="text-base font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF9900" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#FF9900" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00A8A8" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00A8A8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#37475A" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(v: number, name: string) => [
              name === "revenue" ? formatCurrency(v) : v,
              name === "revenue" ? "Revenue" : "Orders",
            ]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #37475A",
              backgroundColor: "#232F3E",
              color: "#fff",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#9CA3AF", paddingTop: 8 }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#FF9900"
            strokeWidth={2}
            fill="url(#colorRevenue)"
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#00A8A8"
            strokeWidth={2}
            fill="url(#colorOrders)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
