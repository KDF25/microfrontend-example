// ---------------------------------------------------------------------------
// Intentional smell: one shared types file for every domain.
// Part of the refactor is to split these by bounded context and move the
// cross-boundary contracts into a shared package (packages/types).
// ---------------------------------------------------------------------------

export type UserId = string;
export type ProductId = string;
export type OrderId = string;

export interface User {
  id: UserId;
  email: string;
  name: string;
  tier: "free" | "plus" | "pro";
  createdAt: string;
}

export interface Product {
  id: ProductId;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  currency: "USD" | "EUR";
  category: string;
  inStock: boolean;
  rating: number;
  imageUrl: string;
}

export interface CartLine {
  productId: ProductId;
  quantity: number;
}

export interface Cart {
  lines: CartLine[];
}

export interface Order {
  id: OrderId;
  userId: UserId;
  items: Array<{ productId: ProductId; quantity: number; priceCents: number }>;
  totalCents: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt: string;
}

export interface FeatureFlags {
  newCart: boolean;
  promoBanner: boolean;
  ordersExport: boolean;
}
