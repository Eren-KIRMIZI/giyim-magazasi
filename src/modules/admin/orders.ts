import type { Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma";
import { ORDER_STATUSES } from "@/modules/orders";

export interface AdminOrderItem {
  id: string;
  name: string;
  sku: string | null;
  size: string | null;
  color: string | null;
  variantId: string | null;
  quantity: number;
  price: number;
}

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  email: string;
  createdAt: Date;
  items: { id: string; name: string; quantity: number; size: string | null; color: string | null }[];
}

export interface AdminOrdersFilter {
  status?: string;
  q?: string;
  page?: number;
}

export const ADMIN_ORDERS_PAGE_SIZE = 50;

export interface AdminOrdersResult {
  orders: AdminOrderRow[];
  total: number;
  page: number;
  pageCount: number;
}

export async function getAdminOrders(
  filter: AdminOrdersFilter
): Promise<AdminOrdersResult> {
  const status = filter.status ?? "";
  const q = (filter.q ?? "").trim();
  const page = Math.max(1, Math.floor(filter.page ?? 1));

  const where: Prisma.OrderWhereInput = {};
  if (status && (ORDER_STATUSES as readonly string[]).includes(status)) {
    where.status = status;
  }
  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { customerEmail: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { user: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  const take = ADMIN_ORDERS_PAGE_SIZE;
  const skip = (page - 1) * take;

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true } },
        items: true,
      },
      skip,
      take,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      total: Number(o.total),
      status: o.status,
      email: o.user?.email ?? o.customerEmail ?? "Misafir",
      createdAt: o.createdAt,
      items: o.items.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      })),
    })),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / take)),
  };
}

export interface AdminOrderDetail {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: string;
  customerName: string | null;
  customerEmail: string | null;
  userName: string | null;
  userEmail: string | null;
  total: number;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  stockConsumed: boolean;
  stockRestored: boolean;
  items: AdminOrderItem[];
}

export async function getAdminOrder(
  id: string
): Promise<AdminOrderDetail | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, name: true } },
      items: true,
    },
  });
  if (!order) return null;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    status: order.status,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    userName: order.user?.name ?? null,
    userEmail: order.user?.email ?? null,
    total: Number(order.total),
    stripeSessionId: order.stripeSessionId,
    stripePaymentIntentId: order.stripePaymentIntentId,
    stockConsumed: order.stockConsumed,
    stockRestored: order.stockRestored,
    items: order.items.map((i) => ({
      id: i.id,
      name: i.name,
      sku: i.sku,
      size: i.size,
      color: i.color,
      variantId: i.variantId,
      quantity: i.quantity,
      price: Number(i.price),
    })),
  };
}
