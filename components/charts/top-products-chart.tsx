"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface TopProductsChartProps {
  data: { name: string; sales: number; revenue: number }[];
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <div className="bg-amazon-navy-mid rounded-xl border border-amazon-navy-light p-6">
      <h3 className="text-base font-semibold text-white mb-4">Top ASINs by Revenue</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#37475A" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={false}
            width={130}
          />
          <Tooltip
            formatter={(v: number) => [formatCurrency(v), "Revenue"]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #37475A",
              backgroundColor: "#232F3E",
              color: "#fff",
            }}
          />
          <Bar dataKey="revenue" fill="#FF9900" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
