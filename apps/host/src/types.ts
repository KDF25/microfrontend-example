// Host-owned types. Narrow these carefully when exporting to remotes:
// the contract shared with remotes should live in `packages/types`, not here.
export type UserId = string;
export type ProductId = string;

export interface User {
  id: UserId;
  email: string;
  name: string;
  tier: "free" | "plus" | "pro";
}

export interface Session {
  user: User | null;
  isAuthenticated: boolean;
}

export interface CartLine {
  productId: ProductId;
  quantity: number;
}

export interface Cart {
  lines: CartLine[];
}
