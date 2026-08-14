import { prisma } from "@/infrastructure/prisma";

const REVENUE_EXCLUDE = ["CANCELLED", "REFUNDED", "FAILED"];

function localDayKey(date: Date) {
  return date.toLocaleDateString("sv-SE");
}

export interface TopSeller {
  productId: string | null;
  name: string;
  quantity: number;
  revenue: number;
}

export interface LowStockVariant {
  id: string;
  sku: string;
  size: string;
  color: string | null;
  stock: number;
  productName: string;
}

export interface RecentOrderRow {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  email: string;
  createdAt: Date;
}

export interface DashboardData {
  productCount: number;
  orderCount: number;
  userCount: number;
  categoryCount: number;
  totalRevenue: number;
  revenue30: number;
  revenueSeries: { label: string; value: number }[];
  topSellers: TopSeller[];
  lowStock: LowStockVariant[];
  failedLast24h: number;
  activeReservations: number;
  recentOrders: RecentOrderRow[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 29);

  const since24h = new Date();
  since24h.setHours(since24h.getHours() - 24);

  const [
    productCount,
    orderCount,
    userCount,
    categoryCount,
    revenueAgg,
    revenue30,
    chartOrders,
    topItems,
    lowStock,
    failed24,
    activeReservations,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.category.count(),
    prisma.order.aggregate({
      where: { status: { notIn: REVENUE_EXCLUDE } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        status: { notIn: REVENUE_EXCLUDE },
        createdAt: { gte: start },
      },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      where: { status: { notIn: REVENUE_EXCLUDE }, createdAt: { gte: start } },
      select: { total: true, createdAt: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productId", "name"],
      where: {
        productId: { not: null },
        order: { status: { notIn: REVENUE_EXCLUDE } },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: { select: { id: true, name: true, slug: true } } },
      orderBy: { stock: "asc" },
      take: 8,
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: since24h },
        status: { in: ["FAILED", "CANCELLED"] },
      },
    }),
    prisma.orderReservation.count({ where: { status: "ACTIVE" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { email: true } } },
    }),
  ]);

  const topIds = topItems
    .map((t) => t.productId)
    .filter((id): id is string => Boolean(id));
  const topRevenueItems = await prisma.orderItem.findMany({
    where: {
      productId: { in: topIds },
      order: { status: { notIn: REVENUE_EXCLUDE } },
    },
    select: { productId: true, quantity: true, price: true },
  });
  const revenueByProduct = new Map<string, number>();
  for (const item of topRevenueItems) {
    if (!item.productId) continue;
    const prev = revenueByProduct.get(item.productId) ?? 0;
    revenueByProduct.set(
      item.productId,
      prev + item.quantity * Number(item.price)
    );
  }

  const buckets = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    buckets.set(localDayKey(d), 0);
  }
  for (const order of chartOrders) {
    const key = localDayKey(order.createdAt);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + Number(order.total));
    }
  }
  const revenueSeries = [...buckets.entries()].map(([key, value]) => ({
    label: `${key.slice(8)}.${key.slice(5, 7)}`,
    value,
  }));

  return {
    productCount,
    orderCount,
    userCount,
    categoryCount,
    totalRevenue: Number(revenueAgg._sum.total ?? 0),
    revenue30: Number(revenue30._sum.total ?? 0),
    revenueSeries,
    topSellers: topItems.map((t) => ({
      productId: t.productId,
      name: t.name,
      quantity: t._sum.quantity ?? 0,
      revenue: revenueByProduct.get(t.productId ?? "") ?? 0,
    })),
    lowStock: lowStock.map((v) => ({
      id: v.id,
      sku: v.sku,
      size: v.size,
      color: v.color,
      stock: v.stock,
      productName: v.product.name,
    })),
    failedLast24h: failed24,
    activeReservations,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      total: Number(o.total),
      status: o.status,
      email: o.user.email,
      createdAt: o.createdAt,
    })),
  };
}
