import type { Order, User } from "@/types";

export const MOCK_USER: User = {
  id: "u-1001",
  email: "alex@example.com",
  name: "Alex Morgan",
  tier: "plus",
  createdAt: "2024-11-02T10:00:00.000Z",
};

export const MOCK_ORDERS: Order[] = [
  {
    id: "o-5001",
    userId: "u-1001",
    items: [
      { productId: "p-001", quantity: 1, priceCents: 7900 },
      { productId: "p-004", quantity: 2, priceCents: 1900 },
    ],
    totalCents: 11700,
    status: "shipped",
    createdAt: "2025-02-12T09:14:00.000Z",
  },
  {
    id: "o-5002",
    userId: "u-1001",
    items: [{ productId: "p-003", quantity: 1, priceCents: 9900 }],
    totalCents: 9900,
    status: "paid",
    createdAt: "2025-03-04T18:22:00.000Z",
  },
  {
    id: "o-5003",
    userId: "u-1001",
    items: [{ productId: "p-007", quantity: 1, priceCents: 4900 }],
    totalCents: 4900,
    status: "pending",
    createdAt: "2026-04-02T12:45:00.000Z",
  },
];

export const getCurrentUser = (): User => MOCK_USER;
export const getOrdersForUser = (userId: string): Order[] =>
  MOCK_ORDERS.filter((o) => o.userId === userId);
