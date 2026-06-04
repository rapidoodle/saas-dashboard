"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { OrdersChart } from "@/components/charts/orders-chart";
import { TopProductsChart } from "@/components/charts/top-products-chart";
import { formatCurrency, percentChange } from "@/lib/utils";

interface AnalyticsData {
  revenueData: { month: string; revenue: number; orders: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    prevRevenue: number;
    prevOrders: number;
  };
}

function StatCard({
  label,
  value,
  change,
  prefix = "",
}: {
  label: string;
  value: string | number;
  change?: number;
  prefix?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">
        {prefix}{value}
      </p>
      {change !== undefined && (
        <p className={`text-xs mt-1 ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% vs last month
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">Loading…</div>
        ) : !data ? (
          <div className="flex items-center justify-center h-64 text-red-500">Failed to load data</div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Revenue (this month)"
                value={formatCurrency(data.stats.totalRevenue)}
                change={percentChange(data.stats.totalRevenue, data.stats.prevRevenue)}
              />
              <StatCard
                label="Orders (this month)"
                value={data.stats.totalOrders}
                change={percentChange(data.stats.totalOrders, data.stats.prevOrders)}
              />
              <StatCard label="Total customers" value={data.stats.totalCustomers} />
              <StatCard label="Total products" value={data.stats.totalProducts} />
            </div>

            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <RevenueChart data={data.revenueData} />
              </div>
              <OrdersChart data={data.ordersByStatus} />
            </div>

            {/* Charts row 2 */}
            <TopProductsChart data={data.topProducts} />
          </>
        )}
      </main>
    </div>
  );
}
