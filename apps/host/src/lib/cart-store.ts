import { create } from "zustand";
import type { Cart, CartLine, ProductId } from "@/types";

// The cart store lives in the host. Remotes interact with it only through
// the narrow contract exposed via context (see HostServicesProvider) — never
// by importing this module directly. Direct imports across MF boundaries
// duplicate the store and silently break.

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
