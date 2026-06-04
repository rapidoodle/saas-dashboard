import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  // Revenue by month (last 6 months)
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: sixMonthsAgo },
      status: { not: "CANCELLED" },
    },
    select: { total: true, createdAt: true, status: true },
  });

  const monthMap: Record<string, { revenue: number; orders: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString("en-US", { month: "short", year: "numeric" });
    monthMap[key] = { revenue: 0, orders: 0 };
  }

  for (const order of orders) {
    const key = new Date(order.createdAt).toLocaleString("en-US", { month: "short", year: "numeric" });
    if (monthMap[key]) {
      monthMap[key].revenue += order.total;
      monthMap[key].orders += 1;
    }
  }

  const revenueData = Object.entries(monthMap).map(([month, data]) => ({
    month,
    revenue: Math.round(data.revenue),
    orders: data.orders,
  }));

  // Orders by status
  const statusCounts = await prisma.order.groupBy({
    by: ["status"],
    _count: { id: true },
  });
  const ordersByStatus = statusCounts.map((s) => ({
    status: s.status,
    count: s._count.id,
  }));

  // Top products by revenue
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { price: true },
    _count: { id: true },
    orderBy: { _sum: { price: "desc" } },
    take: 5,
  });

  const productIds = topProducts.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]));

  const topProductsData = topProducts.map((p) => ({
    name: productMap[p.productId] ?? p.productId,
    sales: p._count.id,
    revenue: Math.round((p._sum.price ?? 0) * 100) / 100,
  }));

  // Summary stats
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonthOrders, lastMonthOrders, totalCustomers, totalProducts] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: thisMonth }, status: { not: "CANCELLED" } },
      _sum: { total: true },
      _count: { id: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: lastMonth, lt: thisMonth }, status: { not: "CANCELLED" } },
      _sum: { total: true },
      _count: { id: true },
    }),
    prisma.customer.count(),
    prisma.product.count(),
  ]);

  return NextResponse.json({
    revenueData,
    ordersByStatus,
    topProducts: topProductsData,
    stats: {
      totalRevenue: Math.round(thisMonthOrders._sum.total ?? 0),
      totalOrders: thisMonthOrders._count.id,
      totalCustomers,
      totalProducts,
      prevRevenue: Math.round(lastMonthOrders._sum.total ?? 0),
      prevOrders: lastMonthOrders._count.id,
    },
  });
}
