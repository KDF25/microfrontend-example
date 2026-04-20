// Account owns Order data. Order lifecycle (pending/paid/shipped/cancelled)
// is a domain concept private to this remote — other apps should not depend
// on the string values. If they need to display status, expose a rendered
// component here, not the raw type.

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; priceCents: number }[];
  totalCents: number;
  status: OrderStatus;
  createdAt: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "o-5001",
    userId: "u-001",
    items: [
      { productId: "p-001", quantity: 1, priceCents: 7900 },
      { productId: "p-004", quantity: 2, priceCents: 1900 },
    ],
    totalCents: 11700,
    status: "shipped",
    createdAt: "2026-01-12T09:14:00.000Z",
  },
  {
    id: "o-5002",
    userId: "u-001",
    items: [{ productId: "p-003", quantity: 1, priceCents: 9900 }],
    totalCents: 9900,
    status: "paid",
    createdAt: "2026-02-04T18:22:00.000Z",
  },
  {
    id: "o-5003",
    userId: "u-001",
    items: [{ productId: "p-007", quantity: 1, priceCents: 4900 }],
    totalCents: 4900,
    status: "pending",
    createdAt: "2026-04-02T12:45:00.000Z",
  },
];

export function getOrdersForUser(userId: string): Order[] {
  return MOCK_ORDERS.filter((o) => o.userId === userId);
}
