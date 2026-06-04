import { Role } from "@prisma/client";

export type { Role };

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: Role[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}
