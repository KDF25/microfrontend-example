import { create } from "zustand";
import type { Cart, CartLine, ProductId } from "@/types";

// ---------------------------------------------------------------------------
// Intentional smell: global cart store imported by Header, ProductCard,
// Checkout, and Account pages. After decomposition, "cart" should belong to
// checkout/host and be exposed to remotes through a narrow contract, not via
// a shared zustand store across MF boundaries (that breaks bundle isolation).
// ---------------------------------------------------------------------------

interface CartState extends Cart {
  add: (productId: ProductId, quantity?: number) => void;
  remove: (productId: ProductId) => void;
  setQuantity: (productId: ProductId, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  lines: [],
  add: (productId, quantity = 1) =>
    set((state) => {
      const existing = state.lines.find((l) => l.productId === productId);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l,
          ),
        };
      }
      const line: CartLine = { productId, quantity };
      return { lines: [...state.lines, line] };
    }),
  remove: (productId) =>
    set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
  setQuantity: (productId, quantity) =>
    set((state) => ({
      lines: state.lines.map((l) =>
        l.productId === productId ? { ...l, quantity } : l,
      ),
    })),
  clear: () => set({ lines: [] }),
  totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
}));
