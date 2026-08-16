import { prisma } from "@/infrastructure/prisma";

export interface OrderItemRow {
  id: string;
  name: string;
  sku: string | null;
  size: string | null;
  color: string | null;
  image: string | null;
  quantity: number;
  price: number;
  productId: string | null;
}

export interface OrderRow {
  id: string;
  userId: string | null;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: Date;
  items: OrderItemRow[];
}

export async function getUserOrders(userId: string): Promise<OrderRow[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return orders.map((o) => ({
    id: o.id,
    userId: o.userId,
    orderNumber: o.orderNumber,
    total: Number(o.total),
    status: o.status,
    createdAt: o.createdAt,
    items: o.items.map((i) => ({
      id: i.id,
      name: i.name,
      sku: i.sku,
      size: i.size,
      color: i.color,
      image: i.image,
      quantity: i.quantity,
      price: Number(i.price),
      productId: i.productId,
    })),
  }));
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<OrderRow | null> {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) return null;

  return {
    id: order.id,
    userId: order.userId,
    orderNumber: order.orderNumber,
    total: Number(order.total),
    status: order.status,
    createdAt: order.createdAt,
    items: order.items.map((i) => ({
      id: i.id,
      name: i.name,
      sku: i.sku,
      size: i.size,
      color: i.color,
      image: i.image,
      quantity: i.quantity,
      price: Number(i.price),
      productId: i.productId,
    })),
  };
}
